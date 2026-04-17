import React, { useState, useRef, useEffect } from "react";

const ChatbotPage = () => {
  // 1. Quản lý toàn bộ các phiên (Sessions)
  const [recentSessions, setRecentSessions] = useState([
    {
      id: 1,
      title: "React Hooks là gì?",
      lastMessageTime: "Hôm nay, 09:32",
      messages: [
        {
          id: 1,
          sender: "ai",
          text: "Xin chào! Tôi có thể giúp gì cho bạn về React?",
          time: "09:30",
        },
        { id: 2, sender: "user", text: "React Hooks là gì?", time: "09:31" },
      ],
    },
    {
      id: 2,
      title: "Giải thích JWT flow",
      lastMessageTime: "Hôm nay, 14:15",
      messages: [
        {
          id: 1,
          sender: "user",
          text: "Giải thích luồng hoạt động của JWT giúp tôi.",
          time: "14:10",
        },
        {
          id: 2,
          sender: "ai",
          text: "JWT (JSON Web Token) hoạt động theo luồng: Client login -> Server cấp Token -> Client lưu Token -> Gửi kèm Token trong Header ở các request sau.",
          time: "14:15",
        },
      ],
    },
  ]);

  // 2. State lưu phiên đang được chọn (Mặc định chọn phiên đầu tiên)
  const [activeSessionId, setActiveSessionId] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  // Lấy ra danh sách tin nhắn của phiên đang active
  const activeSession = recentSessions.find((s) => s.id === activeSessionId);
  const currentMessages = activeSession ? activeSession.messages : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);


  const handleSelectSession = (id) => {
    setActiveSessionId(id);
  };

  // Xử lý xoá phiên
  const handleDeleteSession = (e, id) => {
    e.stopPropagation(); // Quan trọng: Ngăn không cho sự kiện click lan ra ngoài (tránh kích hoạt handleSelectSession)

    setRecentSessions((prev) => {
      const newSessions = prev.filter((s) => s.id !== id);
      // Nếu xoá trúng phiên đang xem, tự động chuyển sang phiên đầu tiên còn lại (nếu có)
      if (activeSessionId === id) {
        setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
      }
      return newSessions;
    });
  };

  // Tạo phiên mới
  const handleNewSession = () => {
    const newId = Date.now();
    const newSession = {
      id: newId,
      title: "Phiên trò chuyện mới",
      lastMessageTime: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      messages: [
        {
          id: 1,
          sender: "ai",
          text: "Xin chào! Tôi có thể giúp gì cho bạn hôm nay?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    };
    setRecentSessions([newSession, ...recentSessions]);
    setActiveSessionId(newId);
  };

  // Xử lý gửi tin nhắn (Cập nhật vào đúng session)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeSessionId) return;

    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newUserMsg = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      time: currentTime,
    };

    // Cập nhật lại state recentSessions, thêm tin nhắn vào session đang active
    setRecentSessions((prevSessions) =>
      prevSessions.map((session) => {
        if (session.id === activeSessionId) {
          return { ...session, messages: [...session.messages, newUserMsg] };
        }
        return session;
      }),
    );
    setInputValue("");

    // Giả lập AI phản hồi
    setTimeout(() => {
      const aiResponseMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Đã nhận thông tin. Đây là tính năng nhiều Session đang hoạt động!",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setRecentSessions((prevSessions) =>
        prevSessions.map((session) => {
          if (session.id === activeSessionId) {
            return {
              ...session,
              messages: [...session.messages, aiResponseMsg],
            };
          }
          return session;
        }),
      );
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="h-full flex-1 bg-white p-6 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            AI Chatbot
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Trợ lý học tập thông minh · BTM Streaming
          </p>
        </div>
        <button
          onClick={handleNewSession}
          className="bg-[#1a2b4c] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 flex items-center gap-2"
        >
          <span>+</span> Phiên mới
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Lịch sử phiên (Sidebar bên trái) */}
        <div className="w-1/3 max-w-sm flex flex-col">
          <div className="bg-white border border-gray-200 rounded-lg flex-1 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Phiên gần đây
              </h2>
            </div>

            <div className="overflow-y-auto flex-1">
              {recentSessions.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Chưa có phiên nào
                </div>
              ) : (
                recentSessions.map((session) => (
                  // Dùng template literals để đổi màu nền nếu session đang active.
                  // Dùng class "group" để hover hiện nút Xoá
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session.id)}
                    className={`p-4 border-b border-gray-100 cursor-pointer flex justify-between items-start group transition-colors ${
                      activeSessionId === session.id
                        ? "bg-[#f0f7ff]"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <h3
                        className={`text-sm truncate ${activeSessionId === session.id ? "font-bold text-blue-900" : "font-semibold text-gray-700"}`}
                      >
                        {session.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {session.lastMessageTime}
                      </p>
                    </div>

                    {/* Nút Xoá (Thùng rác) - Chỉ hiện rõ khi hover vào cả khung session */}
                    <button
                      onClick={(e) => handleDeleteSession(e, session.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      title="Xoá phiên"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Cửa sổ Chat (Bên phải) */}
        <div className="flex-1 flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden">
          {!activeSessionId ? (
            // Trạng thái trống (Empty state) khi không có session nào được chọn
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500">
                Hãy chọn một phiên bên trái hoặc tạo phiên mới.
              </p>
            </div>
          ) : (
            <>
              {/* Header Chat */}
              <div className="px-4 py-3 border-b border-gray-200 flex items-center gap-3 bg-white">
                <div className="w-8 h-8 bg-[#f0f7ff] text-blue-600 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900">
                    {activeSession?.title}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    <span className="text-xs text-green-600 font-medium">
                      Online
                    </span>
                  </div>
                </div>
              </div>

              {/* Nội dung Chat */}
              <div className="flex-1 p-4 overflow-y-auto space-y-6 bg-[#fafafa]">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`text-sm px-4 py-3 rounded-2xl max-w-[80%] whitespace-pre-wrap ${
                        msg.sender === "user"
                          ? "bg-[#1a2b4c] text-white rounded-tr-none"
                          : "bg-[#f0f2f5] text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[11px] text-gray-400 mt-1">
                      {msg.time}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Ô Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1.5 focus-within:ring-1 focus-within:ring-blue-500">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none text-gray-700"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                    className="bg-[#1a2b4c] disabled:opacity-50 hover:bg-opacity-90 text-white px-5 py-1.5 rounded-md text-sm font-medium transition-colors"
                  >
                    Gửi
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
