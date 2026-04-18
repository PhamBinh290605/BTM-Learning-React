import { useEffect, useMemo, useRef, useState } from "react";
import {
  createChatMessage,
  createDefaultChatSession,
  createSessionTitleFromFirstQuestion,
  getAIPromptSuggestions,
  sendChatToAIMock,
} from "../../api/aiAssistant";

const CHAT_SESSIONS_STORAGE_KEY = "btm-ai-chat-sessions-v1";
const ACTIVE_CHAT_SESSION_STORAGE_KEY = "btm-ai-chat-active-session-v1";
const STREAM_SPEED_MS = 16;

const sortSessionsByRecent = (sessions) =>
  [...sessions].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

const readStoredSessions = () => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CHAT_SESSIONS_STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return sortSessionsByRecent(parsed);
  } catch {
    return [];
  }
};

const readStoredActiveSessionId = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(ACTIVE_CHAT_SESSION_STORAGE_KEY);
};

const formatSessionTime = (isoTime) => {
  if (!isoTime) return "Vừa xong";

  const now = Date.now();
  const then = new Date(isoTime).getTime();
  const diffMinutes = Math.floor((now - then) / (1000 * 60));

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} giờ trước`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return new Date(isoTime).toLocaleDateString("vi-VN");
};

const formatClock = (isoTime) => {
  if (!isoTime) return "";

  return new Date(isoTime).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getSessionPreview = (session) => {
  const lastMessage = session?.messages?.[session.messages.length - 1];
  const content = lastMessage?.content || "";

  if (!content) return "Chưa có tin nhắn";
  if (content.length <= 58) return content;
  return `${content.slice(0, 55)}...`;
};

const ChatbotWidget = ({ context = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSessionListMobile, setShowSessionListMobile] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState(() => getAIPromptSuggestions(context));

  const [sessions, setSessions] = useState(() => {
    const storedSessions = readStoredSessions();
    if (storedSessions.length) return storedSessions;

    return [createDefaultChatSession(context)];
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    const storedSessions = readStoredSessions();
    const storedActiveId = readStoredActiveSessionId();

    if (storedActiveId && storedSessions.some((session) => session.id === storedActiveId)) {
      return storedActiveId;
    }

    return storedSessions[0]?.id || null;
  });

  const streamTimerRef = useRef(null);
  const messagesEndRef = useRef(null);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) || null,
    [sessions, activeSessionId],
  );

  const updateSession = (sessionId, updater, shouldSort = false) => {
    setSessions((previousSessions) => {
      const nextSessions = previousSessions.map((session) =>
        session.id === sessionId ? updater(session) : session,
      );
      return shouldSort ? sortSessionsByRecent(nextSessions) : nextSessions;
    });
  };

  useEffect(() => {
    if (!activeSessionId && sessions.length) {
      setActiveSessionId(sessions[0].id);
    }
  }, [activeSessionId, sessions]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(CHAT_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!activeSessionId) {
      window.localStorage.removeItem(ACTIVE_CHAT_SESSION_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(ACTIVE_CHAT_SESSION_STORAGE_KEY, activeSessionId);
  }, [activeSessionId]);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, activeSession?.messages.length]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  const handleCreateSession = () => {
    const newSession = createDefaultChatSession(context);

    setSessions((previousSessions) => sortSessionsByRecent([newSession, ...previousSessions]));
    setActiveSessionId(newSession.id);
    setSuggestions(getAIPromptSuggestions(context));
    setShowSessionListMobile(false);
    setIsOpen(true);
  };

  const handleDeleteSession = (event, sessionId) => {
    event.stopPropagation();

    const nextSessions = sessions.filter((session) => session.id !== sessionId);

    if (!nextSessions.length) {
      const fallbackSession = createDefaultChatSession(context);
      setSessions([fallbackSession]);
      setActiveSessionId(fallbackSession.id);
      setSuggestions(getAIPromptSuggestions(context));
      return;
    }

    const sortedSessions = sortSessionsByRecent(nextSessions);
    setSessions(sortedSessions);

    if (activeSessionId === sessionId) {
      setActiveSessionId(sortedSessions[0].id);
    }
  };

  const streamAssistantReply = ({ sessionId, messageId, finalText }) =>
    new Promise((resolve) => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }

      const chars = Array.from(finalText);
      if (!chars.length) {
        resolve();
        return;
      }

      let pointer = 0;

      streamTimerRef.current = setInterval(() => {
        pointer += Math.max(1, Math.ceil(chars.length / 120));

        const partialText = chars.slice(0, pointer).join("");
        updateSession(
          sessionId,
          (session) => ({
            ...session,
            messages: session.messages.map((message) =>
              message.id === messageId
                ? {
                    ...message,
                    content: partialText,
                  }
                : message,
            ),
          }),
          false,
        );

        if (pointer >= chars.length) {
          clearInterval(streamTimerRef.current);
          streamTimerRef.current = null;
          resolve();
        }
      }, STREAM_SPEED_MS);
    });

  const handleSendMessage = async (quickMessage) => {
    if (isStreaming) return;

    const text = (quickMessage || inputValue).trim();
    if (!text) return;

    let targetSession = activeSession;
    let targetSessionId = activeSessionId;

    if (!targetSession || !targetSessionId) {
      targetSession = createDefaultChatSession(context);
      targetSessionId = targetSession.id;
      setSessions((previousSessions) => sortSessionsByRecent([targetSession, ...previousSessions]));
      setActiveSessionId(targetSessionId);
    }

    const userMessage = createChatMessage({ role: "user", content: text });
    const assistantPlaceholder = createChatMessage({ role: "assistant", content: "" });
    const mergedContext = {
      ...(targetSession?.context || {}),
      ...context,
    };

    updateSession(
      targetSessionId,
      (session) => {
        const shouldUpdateTitle =
          session.title === "Phiên trò chuyện mới" &&
          session.messages.filter((message) => message.role === "user").length === 0;

        return {
          ...session,
          title: shouldUpdateTitle
            ? createSessionTitleFromFirstQuestion(text)
            : session.title,
          updatedAt: new Date().toISOString(),
          context: mergedContext,
          messages: [...session.messages, userMessage, assistantPlaceholder],
        };
      },
      true,
    );

    setInputValue("");
    setIsStreaming(true);
    setShowSessionListMobile(false);

    try {
      const history = [
        ...(targetSession?.messages || []),
        userMessage,
      ]
        .slice(-12)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));

      const response = await sendChatToAIMock({
        message: text,
        context: mergedContext,
        history,
      });

      if (Array.isArray(response.suggestions) && response.suggestions.length) {
        setSuggestions(response.suggestions);
      }

      await streamAssistantReply({
        sessionId: targetSessionId,
        messageId: assistantPlaceholder.id,
        finalText: response.reply,
      });

      updateSession(
        targetSessionId,
        (session) => ({
          ...session,
          updatedAt: new Date().toISOString(),
        }),
        true,
      );
    } catch {
      updateSession(
        targetSessionId,
        (session) => ({
          ...session,
          updatedAt: new Date().toISOString(),
          messages: session.messages.map((message) =>
            message.id === assistantPlaceholder.id
              ? {
                  ...message,
                  content:
                    "AI đang bận, bạn thử lại sau vài giây hoặc dùng một gợi ý nhanh bên dưới nhé.",
                }
              : message,
          ),
        }),
        true,
      );
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSendMessage();
  };

  const handleKeyDown = (event) => {
    if (event.nativeEvent.isComposing) return;

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const contextLabel = activeSession?.context?.lessonTitle
    ? `Ngữ cảnh: ${activeSession.context.lessonTitle}`
    : activeSession?.context?.courseTitle
      ? `Ngữ cảnh: ${activeSession.context.courseTitle}`
      : "Ngữ cảnh: Trợ lý học tập";

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-2xl shadow-indigo-500/30 transition-transform hover:scale-[1.03]"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z"
              />
            </svg>
          </span>
          <span className="hidden sm:inline">AI Chat</span>
        </button>
      )}

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-[1px] sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-3 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/[0.08] dark:bg-slate-900 sm:inset-auto sm:bottom-5 sm:right-5 sm:h-[min(82vh,740px)] sm:w-[min(95vw,980px)]">
            <div className="flex h-full min-w-0">
              <aside
                className={`${showSessionListMobile ? "flex" : "hidden"} w-full flex-col border-r border-slate-200 bg-slate-50 dark:border-white/[0.08] dark:bg-slate-950 sm:flex sm:w-72`}
              >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                      Lịch sử phiên
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {sessions.length} phiên
                    </p>
                  </div>
                  <button
                    onClick={handleCreateSession}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    title="Tạo phiên mới"
                  >
                    +
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {sessions.map((session) => {
                    const isActive = session.id === activeSessionId;

                    return (
                      <button
                        key={session.id}
                        onClick={() => {
                          setActiveSessionId(session.id);
                          setShowSessionListMobile(false);
                        }}
                        className={`group w-full border-b border-slate-200 px-4 py-3 text-left transition-colors dark:border-white/[0.06] ${
                          isActive
                            ? "bg-indigo-50 text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-200"
                            : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{session.title}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                              {getSessionPreview(session)}
                            </p>
                            <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                              {formatSessionTime(session.updatedAt)}
                            </p>
                          </div>

                          <span
                            onClick={(event) => handleDeleteSession(event, session.id)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-500/10"
                            title="Xóa phiên"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <section className={`${showSessionListMobile ? "hidden" : "flex"} min-w-0 flex-1 flex-col sm:flex`}>
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/[0.08]">
                  <div className="flex min-w-0 items-center gap-2">
                    <button
                      onClick={() => setShowSessionListMobile(true)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 dark:border-white/[0.1] dark:text-slate-300 sm:hidden"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {activeSession?.title || "AI Assistant"}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {contextLabel}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/[0.1] dark:text-slate-300 dark:hover:bg-white/[0.06]"
                    title="Đóng"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-slate-50 px-4 py-4 dark:from-slate-900 dark:to-slate-950">
                  {!activeSession ? (
                    <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                      Chọn một phiên để bắt đầu.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeSession.messages.map((message) => {
                        const isUser = message.role === "user";

                        return (
                          <div
                            key={message.id}
                            className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[86%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                isUser
                                  ? "rounded-tr-md bg-indigo-600 text-white"
                                  : "rounded-tl-md border border-slate-200 bg-white text-slate-700 dark:border-white/[0.08] dark:bg-slate-800 dark:text-slate-200"
                              }`}
                            >
                              <p>{message.content || (isStreaming ? "..." : "")}</p>
                              <p
                                className={`mt-1.5 text-[11px] ${
                                  isUser ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"
                                }`}
                              >
                                {formatClock(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {!!suggestions.length && (
                  <div className="border-t border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/[0.08] dark:bg-slate-900/80">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                      Gợi ý AI
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => handleSendMessage(prompt)}
                          disabled={isStreaming}
                          className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:border-indigo-400 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/[0.14] dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-400"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="border-t border-slate-200 bg-white px-4 py-3 dark:border-white/[0.08] dark:bg-slate-900"
                >
                  <div className="flex items-end gap-2">
                    <textarea
                      rows={1}
                      value={inputValue}
                      onChange={(event) => setInputValue(event.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập câu hỏi cho AI..."
                      className="max-h-28 min-h-10 flex-1 resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-500 dark:border-white/[0.14] dark:bg-slate-950 dark:text-slate-200"
                    />
                    <button
                      type="submit"
                      disabled={isStreaming || !inputValue.trim()}
                      className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isStreaming ? "Đang trả lời" : "Gửi"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatbotWidget;
