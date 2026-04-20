import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import ChatbotWidget from "../../components/ChatbotWidget";
import courseApi from "../../../api/courseApi";
import axiosClient from "../../../api/axiosClient";
import quizApi from "../../../api/quizApi";
import { resolveMediaUrl } from "../../../utils/media";
import { getAccessToken } from "../../../utils/session";

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatLessonDuration = (seconds) => {
  const safeSeconds = Math.max(0, toNumber(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const restSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
};

const formatCountdown = (seconds) => {
  const safeSeconds = Math.max(0, toNumber(seconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const restSeconds = safeSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
};

const toLessonType = (lessonType) => {
  const normalized = String(lessonType || "").toUpperCase();

  if (normalized === "QUIZ") return "quiz";
  if (normalized === "DOCUMENT" || normalized === "TEXT") return "document";

  return "video";
};

const normalizeQuestionType = (questionType) => String(questionType || "SINGLE_CHOICE").toUpperCase();

const isEssayQuestionType = (questionType) => {
  const normalized = normalizeQuestionType(questionType);
  return normalized === "ESSAY" || normalized === "SHORT_ANSWER";
};

const toQuizViewModel = (rawQuiz) => {
  const sortedQuestions = [...(rawQuiz?.questions || [])].sort(
    (firstQuestion, secondQuestion) =>
      toNumber(firstQuestion?.sortOrder) - toNumber(secondQuestion?.sortOrder),
  );

  const mappedQuestions = sortedQuestions.map((quizQuestion, index) => {
    const question = quizQuestion?.question || quizQuestion || {};
    const rawAnswers = question?.answers || quizQuestion?.answers || [];
    const questionId = toNumber(
      question?.id ?? quizQuestion?.questionId ?? quizQuestion?.id,
      index + 1,
    );

    return {
      quizQuestionId: toNumber(quizQuestion?.id, index + 1),
      id: questionId,
      content: question?.content || question?.text || `Câu hỏi ${index + 1}`,
      questionType: normalizeQuestionType(question?.questionType || quizQuestion?.questionType),
      score: toNumber(quizQuestion?.score, 1),
      answers: rawAnswers.map((answer, answerIndex) => ({
        id: toNumber(answer?.id, answerIndex + 1),
        content: answer?.content || answer?.text || `Đáp án ${answerIndex + 1}`,
      })),
    };
  });

  return {
    id: toNumber(rawQuiz?.id),
    title: rawQuiz?.title || "Bài kiểm tra",
    timeLimit: toNumber(rawQuiz?.timeLimit ?? rawQuiz?.timeLimitMin),
    totalQuestions: toNumber(rawQuiz?.totalQuestions, mappedQuestions.length),
    questions: mappedQuestions,
  };
};

const toLearningViewModel = (rawCourse, progressData) => {
  const progressByLessonId = new Map();

  (progressData?.sections || []).forEach((section) => {
    (section.lessons || []).forEach((lessonProgress) => {
      progressByLessonId.set(lessonProgress.lessonId, lessonProgress);
    });
  });

  const sections = [...(rawCourse?.sections || [])]
    .sort(
      (firstSection, secondSection) =>
        toNumber(firstSection.orderIndex) - toNumber(secondSection.orderIndex),
    )
    .map((section) => {
      const mappedLessons = [...(section.lessons || [])]
        .sort(
          (firstLesson, secondLesson) =>
            toNumber(firstLesson.orderIndex) - toNumber(secondLesson.orderIndex),
        )
        .map((lesson) => {
          const lessonProgress = progressByLessonId.get(lesson.id);
          const status = String(lessonProgress?.status || "").toUpperCase();

          return {
            id: lesson.id,
            title: lesson.title,
            duration: formatLessonDuration(lesson.durationSeconds),
            durationSeconds: toNumber(lesson.durationSeconds),
            completed: status === "COMPLETED",
            type: toLessonType(lesson.lessonType),
            videoUrl: lesson.videoUrl || "",
            documentUrl: lesson.documentUrl || "",
            quizId: lesson?.quizzes?.[0]?.id || lesson?.quizResponse?.id || lesson?.quizId || lesson?.quiz?.id,
          };
        });

      return {
        id: section.id,
        title: section.title,
        lessons: mappedLessons,
      };
    });

  const allLessons = sections.flatMap((section) => section.lessons);
  const completedLessons = allLessons.filter((lesson) => lesson.completed).length;
  const computedProgress = allLessons.length
    ? Math.round((completedLessons / allLessons.length) * 100)
    : 0;

  return {
    id: rawCourse.id,
    title: rawCourse.title,
    thumbnailUrl: rawCourse.thumbnailUrl || "",
    sections,
    progressPercent: toNumber(progressData?.progressPercent, computedProgress),
  };
};

const LearningPlayer = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeLesson, setActiveLesson] = useState(0);
  const [expandedSections, setExpandedSections] = useState([0]);
  const [activeTab, setActiveTab] = useState("notes");
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState([]);
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [quizCache, setQuizCache] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState({});
  const [isQuizLoading, setIsQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState("");
  const [quizTimeRemainingById, setQuizTimeRemainingById] = useState({});
  const [quizTimeExpiredById, setQuizTimeExpiredById] = useState({});
  const [submittingQuizId, setSubmittingQuizId] = useState(null);
  const [autoSubmittingQuizId, setAutoSubmittingQuizId] = useState(null);
  const [isSyncingProgress, setIsSyncingProgress] = useState(false);
  const quizAutoSubmittedRef = useRef({});

  const navigateToLogin = () => {
    const returnUrl = `${window.location.pathname}${window.location.search || ""}`;
    navigate(`/auth/login?redirect=${encodeURIComponent(returnUrl)}`);
  };

  useEffect(() => {
    let isMounted = true;

    const loadLearningCourse = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const [courseResponse, progressResponse] = await Promise.all([
          courseApi.getCourseById(id),
          axiosClient.get(`/courses/progress/${id}`).catch(() => null),
        ]);

        const rawCourse = courseResponse?.data?.result;
        if (!rawCourse) {
          throw new Error("Không tìm thấy khóa học.");
        }

        const progressData = progressResponse?.data?.result;
        const mappedCourse = toLearningViewModel(rawCourse, progressData);

        if (!isMounted) return;

        const allLessons = mappedCourse.sections.flatMap((section) => section.lessons);
        const firstNotCompletedIndex = allLessons.findIndex((lesson) => !lesson.completed);
        const nextActiveIndex = firstNotCompletedIndex >= 0 ? firstNotCompletedIndex : 0;
        const activeSectionIndex = mappedCourse.sections.findIndex((section) =>
          section.lessons.some((lesson) => lesson.id === allLessons[nextActiveIndex]?.id),
        );

        setCourse(mappedCourse);
        setActiveLesson(nextActiveIndex);
        setExpandedSections(activeSectionIndex >= 0 ? [activeSectionIndex] : [0]);
      } catch {
        if (!isMounted) return;
        setErrorMessage("Không tải được nội dung khóa học. Vui lòng thử lại sau.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      loadLearningCourse();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const allLessons = useMemo(
    () =>
      (course?.sections || []).flatMap((section, sectionIndex) =>
        section.lessons.map((lesson, lessonIndex) => ({
          ...lesson,
          sectionIndex,
          lessonIndex,
          sectionTitle: section.title,
        })),
      ),
    [course?.sections],
  );

  useEffect(() => {
    if (!allLessons.length) return;

    if (activeLesson < 0 || activeLesson >= allLessons.length) {
      setActiveLesson(0);
    }
  }, [activeLesson, allLessons.length]);

  const sectionStartIndexes = useMemo(() => {
    const indexes = [];
    let offset = 0;

    (course?.sections || []).forEach((section, index) => {
      indexes[index] = offset;
      offset += section.lessons.length;
    });

    return indexes;
  }, [course?.sections]);

  const currentLesson = allLessons[activeLesson] || null;
  const activeSection = currentLesson
    ? (course?.sections || [])[currentLesson.sectionIndex]
    : null;
  const completedCount = allLessons.filter((lesson) => lesson.completed).length;

  const courseThumbnailUrl = resolveMediaUrl(course?.thumbnailUrl);
  const currentVideoUrl = resolveMediaUrl(currentLesson?.videoUrl);
  const currentDocumentUrl = resolveMediaUrl(currentLesson?.documentUrl);
  const currentQuizId = currentLesson?.quizId ? String(currentLesson.quizId) : "";
  const currentQuiz = currentQuizId ? quizCache[currentQuizId] : null;
  const currentQuizAnswerMap = currentQuizId ? (quizAnswers[currentQuizId] || {}) : {};
  const currentQuizResult = currentQuizId ? quizResults[currentQuizId] : null;
  const isSubmittingCurrentQuiz = submittingQuizId === currentQuizId;
  const isAutoSubmittingCurrentQuiz = autoSubmittingQuizId === currentQuizId;
  const isCurrentQuizLesson = currentLesson?.type === "quiz";
  const hasCurrentQuizTimeLimit = isCurrentQuizLesson && toNumber(currentQuiz?.timeLimit) > 0;
  const currentQuizInitialSeconds = hasCurrentQuizTimeLimit
    ? Math.max(toNumber(currentQuiz?.timeLimit), 0) * 60
    : 0;
  const currentQuizTimeRemaining = currentQuizId
    ? toNumber(quizTimeRemainingById[currentQuizId], currentQuizInitialSeconds)
    : 0;
  const isCurrentQuizTimeExpired = currentQuizId
    ? !!quizTimeExpiredById[currentQuizId]
    : false;
  const isQuizInteractionLocked = isSubmittingCurrentQuiz || isAutoSubmittingCurrentQuiz || isCurrentQuizTimeExpired;

  const chatbotContext = useMemo(
    () => ({
      page: "learning-player",
      courseId: course?.id,
      courseTitle: course?.title || "",
      sectionTitle: activeSection?.title || "",
      lessonTitle: currentLesson?.title || "",
      lessonOrder: activeLesson + 1,
      totalLessons: allLessons.length,
    }),
    [activeLesson, activeSection?.title, allLessons.length, course?.id, course?.title, currentLesson?.title],
  );

  const goToLesson = (globalIndex) => {
    setActiveLesson(globalIndex);
  };

  const goNext = () => {
    if (activeLesson < allLessons.length - 1) setActiveLesson(activeLesson + 1);
  };

  const goPrev = () => {
    if (activeLesson > 0) setActiveLesson(activeLesson - 1);
  };

  const toggleSection = (index) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index],
    );
  };

  const addNote = () => {
    if (!noteText.trim() || !currentLesson) return;

    setNotes((prev) => [
      ...prev,
      {
        text: noteText,
        timestamp: currentLesson.title,
        date: new Date().toLocaleDateString("vi-VN"),
      },
    ]);

    setNoteText("");
  };

  const markLessonCompletedLocally = (lessonId) => {
    setCourse((prevCourse) => {
      if (!prevCourse) return prevCourse;

      let hasChanges = false;
      const nextSections = prevCourse.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) => {
          if (lesson.id !== lessonId || lesson.completed) {
            return lesson;
          }

          hasChanges = true;
          return {
            ...lesson,
            completed: true,
          };
        }),
      }));

      if (!hasChanges) {
        return prevCourse;
      }

      const flattenedLessons = nextSections.flatMap((section) => section.lessons);
      const nextCompletedCount = flattenedLessons.filter((lesson) => lesson.completed).length;
      const nextProgressPercent = flattenedLessons.length
        ? Math.round((nextCompletedCount / flattenedLessons.length) * 100)
        : 0;

      return {
        ...prevCourse,
        sections: nextSections,
        progressPercent: nextProgressPercent,
      };
    });
  };

  const handleMarkCurrentLessonCompleted = async () => {
    if (!currentLesson || isCurrentQuizLesson) {
      if (isCurrentQuizLesson) {
        toast("Bài quiz cần nộp kết quả thay vì đánh dấu thủ công.");
      }
      return;
    }

    if (!getAccessToken()) {
      toast.error("Bạn cần đăng nhập để lưu tiến độ học tập.");
      navigateToLogin();
      return;
    }

    try {
      setIsSyncingProgress(true);

      const watchedSeconds = currentLesson.type === "video"
        ? Math.max(toNumber(currentLesson.durationSeconds), 1)
        : 0;

      await axiosClient.post("/lesson/update-progress", {
        lessonId: currentLesson.id,
        watchedSeconds,
      });

      markLessonCompletedLocally(currentLesson.id);
      toast.success("Đã đánh dấu hoàn thành bài học.");
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        navigateToLogin();
        return;
      }

      toast.error("Không thể cập nhật tiến độ. Vui lòng thử lại.");
    } finally {
      setIsSyncingProgress(false);
    }
  };

  useEffect(() => {
    if (!isCurrentQuizLesson) {
      setQuizError("");
      return;
    }

    let isMounted = true;

    const loadQuiz = async () => {
      try {
        setIsQuizLoading(true);
        setQuizError("");

        let resolvedQuizId = currentQuizId;
        let rawQuiz = null;
        const lessonId = currentLesson?.id;

        if (resolvedQuizId) {
          if (quizCache[resolvedQuizId]) {
            return;
          }

          try {
            const response = await quizApi.getQuizById(resolvedQuizId);
            rawQuiz = response?.data?.result || null;
          } catch (error) {
            if (error?.response?.status === 401 || error?.response?.status === 403) {
              throw error;
            }

            // Fallback when cached relation is stale or was linked incorrectly in old data.
            if (lessonId) {
              const fallbackResponse = await quizApi.getQuizByLessonId(lessonId);
              rawQuiz = fallbackResponse?.data?.result || null;
            } else {
              throw error;
            }
          }
        }

        if (!rawQuiz && lessonId) {
          const response = await quizApi.getQuizByLessonId(lessonId);
          rawQuiz = response?.data?.result || null;
        }

        if (!rawQuiz) {
          throw new Error("Quiz data not found");
        }

        resolvedQuizId = String(rawQuiz.id || resolvedQuizId || "");
        if (!resolvedQuizId) {
          throw new Error("Quiz id not found");
        }

        const mappedQuiz = toQuizViewModel(rawQuiz);

        if (!isMounted) return;

        setQuizCache((prev) => ({
          ...prev,
          [resolvedQuizId]: mappedQuiz,
        }));

        setQuizAnswers((prev) => (
          prev[resolvedQuizId]
            ? prev
            : {
              ...prev,
              [resolvedQuizId]: {},
            }
        ));

        if (currentLesson?.id && String(currentLesson.quizId || "") !== String(mappedQuiz.id || "")) {
          setCourse((prevCourse) => {
            if (!prevCourse) return prevCourse;

            let hasChanges = false;
            const nextSections = prevCourse.sections.map((section) => ({
              ...section,
              lessons: section.lessons.map((lesson) => {
                if (lesson.id !== currentLesson.id) {
                  return lesson;
                }

                hasChanges = true;
                return {
                  ...lesson,
                  quizId: mappedQuiz.id,
                };
              }),
            }));

            return hasChanges
              ? {
                ...prevCourse,
                sections: nextSections,
              }
              : prevCourse;
          });
        }

        setQuizError("");
      } catch (error) {
        if (!isMounted) return;

        if (error?.response?.status === 401 || error?.response?.status === 403) {
          setQuizError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để làm bài quiz.");
          return;
        }

        setQuizError("Không tải được nội dung quiz. Vui lòng thử lại.");
      } finally {
        if (isMounted) {
          setIsQuizLoading(false);
        }
      }
    };

    loadQuiz();

    return () => {
      isMounted = false;
    };
  }, [currentLesson?.id, currentQuizId, isCurrentQuizLesson, quizCache]);

  useEffect(() => {
    if (!isCurrentQuizLesson || !currentQuizId || !currentQuiz || !hasCurrentQuizTimeLimit) {
      return;
    }

    setQuizTimeRemainingById((prev) => (
      prev[currentQuizId] != null
        ? prev
        : {
          ...prev,
          [currentQuizId]: currentQuizInitialSeconds,
        }
    ));

    setQuizTimeExpiredById((prev) => (
      prev[currentQuizId] !== undefined
        ? prev
        : {
          ...prev,
          [currentQuizId]: false,
        }
    ));
  }, [
    currentQuiz,
    currentQuizId,
    currentQuizInitialSeconds,
    hasCurrentQuizTimeLimit,
    isCurrentQuizLesson,
  ]);

  const handleSelectQuizAnswer = (questionId, selectedAnswerId) => {
    if (!currentQuizId || isQuizInteractionLocked) return;

    const key = String(questionId);
    setQuizAnswers((prev) => ({
      ...prev,
      [currentQuizId]: {
        ...(prev[currentQuizId] || {}),
        [key]: {
          selectedAnswerId,
          essayAnswer: "",
        },
      },
    }));
  };

  const handleEssayAnswerChange = (questionId, essayAnswer) => {
    if (!currentQuizId || isQuizInteractionLocked) return;

    const key = String(questionId);
    setQuizAnswers((prev) => ({
      ...prev,
      [currentQuizId]: {
        ...(prev[currentQuizId] || {}),
        [key]: {
          selectedAnswerId: null,
          essayAnswer,
        },
      },
    }));
  };

  const handleSubmitQuizAttempt = async ({ forceSubmit = false, triggeredByTimer = false } = {}) => {
    if (!currentQuiz || !currentQuizId || !currentLesson) return;

    if (!getAccessToken()) {
      toast.error("Bạn cần đăng nhập để nộp bài quiz.");
      navigateToLogin();
      return;
    }

    const unansweredQuestions = currentQuiz.questions.filter((question) => {
      const answerState = currentQuizAnswerMap[String(question.id)] || {};

      if (isEssayQuestionType(question.questionType)) {
        return !String(answerState.essayAnswer || "").trim();
      }

      return !toNumber(answerState.selectedAnswerId);
    });

    if (!forceSubmit && unansweredQuestions.length > 0) {
      toast.error("Vui lòng trả lời hết các câu trước khi nộp bài.");
      return;
    }

    const answers = currentQuiz.questions.map((question) => {
      const answerState = currentQuizAnswerMap[String(question.id)] || {};

      if (isEssayQuestionType(question.questionType)) {
        const essayAnswer = String(answerState.essayAnswer || "").trim();
        return {
          questionId: question.id,
          essayAnswer: essayAnswer || null,
        };
      }

      const selectedAnswerId = toNumber(answerState.selectedAnswerId, 0);

      return {
        questionId: question.id,
        selectedAnswerId: selectedAnswerId > 0 ? selectedAnswerId : null,
      };
    });

    try {
      setSubmittingQuizId(currentQuizId);

      const response = await quizApi.submitQuizAttempt({
        quizId: currentQuiz.id,
        answers,
      });

      const result = response?.data?.result;

      setQuizResults((prev) => ({
        ...prev,
        [currentQuizId]: result || null,
      }));

      await axiosClient.post("/lesson/update-progress", {
        lessonId: currentLesson.id,
        watchedSeconds: 0,
        quizScore: toNumber(result?.score),
      });

      markLessonCompletedLocally(currentLesson.id);
      toast.success(triggeredByTimer ? "Đã tự động nộp bài khi hết giờ." : "Nộp quiz thành công.");

      if (hasCurrentQuizTimeLimit) {
        setQuizTimeExpiredById((prev) => ({
          ...prev,
          [currentQuizId]: triggeredByTimer || currentQuizTimeRemaining <= 0,
        }));
      }
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        navigateToLogin();
        return;
      }

      toast.error("Nộp quiz thất bại. Vui lòng thử lại.");
    } finally {
      setSubmittingQuizId(null);
    }
  };

  useEffect(() => {
    if (!isCurrentQuizLesson || !currentQuizId || !currentQuiz || !hasCurrentQuizTimeLimit) {
      return;
    }

    if (isQuizLoading || isSubmittingCurrentQuiz || isAutoSubmittingCurrentQuiz || currentQuizResult || isCurrentQuizTimeExpired) {
      return;
    }

    if (currentQuizTimeRemaining <= 0) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setQuizTimeRemainingById((prev) => ({
        ...prev,
        [currentQuizId]: Math.max(toNumber(prev[currentQuizId], currentQuizInitialSeconds) - 1, 0),
      }));
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    currentQuiz,
    currentQuizId,
    currentQuizInitialSeconds,
    currentQuizResult,
    currentQuizTimeRemaining,
    hasCurrentQuizTimeLimit,
    isAutoSubmittingCurrentQuiz,
    isCurrentQuizLesson,
    isCurrentQuizTimeExpired,
    isQuizLoading,
    isSubmittingCurrentQuiz,
  ]);

  useEffect(() => {
    if (!isCurrentQuizLesson || !currentQuizId || !currentQuiz || !hasCurrentQuizTimeLimit) {
      return;
    }

    if (
      currentQuizTimeRemaining > 0
      || isSubmittingCurrentQuiz
      || isAutoSubmittingCurrentQuiz
      || currentQuizResult
      || quizAutoSubmittedRef.current[currentQuizId]
    ) {
      return;
    }

    quizAutoSubmittedRef.current[currentQuizId] = true;
    setQuizTimeExpiredById((prev) => ({
      ...prev,
      [currentQuizId]: true,
    }));
    setAutoSubmittingQuizId(currentQuizId);

    const submitWhenExpired = async () => {
      toast("Hết thời gian. Hệ thống đang tự động nộp bài.");

      try {
        await handleSubmitQuizAttempt({ forceSubmit: true, triggeredByTimer: true });
      } finally {
        setAutoSubmittingQuizId(null);
      }
    };

    submitWhenExpired();
  }, [
    currentQuiz,
    currentQuizId,
    currentQuizResult,
    currentQuizTimeRemaining,
    hasCurrentQuizTimeLimit,
    isAutoSubmittingCurrentQuiz,
    isCurrentQuizLesson,
    isSubmittingCurrentQuiz,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
          <div className="h-72 rounded-2xl bg-slate-800" />
          <div className="h-28 rounded-2xl bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!course || !!errorMessage) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-5 text-red-300">
          <p className="text-sm font-medium">{errorMessage || "Không tìm thấy nội dung khóa học."}</p>
          <button
            onClick={() => navigate("/my-learning")}
            className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Quay lại khóa học của tôi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col lg:flex-row">
      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/95 backdrop-blur px-4 sm:px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wide text-slate-500">Không gian học tập</p>
              <p className="text-sm font-semibold text-white truncate">{course.title}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center rounded-lg border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Trang chính
              </button>
              <button
                onClick={() => navigate("/my-learning")}
                className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Thoát màn hình học
              </button>
            </div>
          </div>
        </div>

        <div className="relative bg-black aspect-video w-full overflow-hidden">
          {isCurrentQuizLesson ? (
            <div className="h-full w-full overflow-y-auto bg-slate-950 px-4 sm:px-8 py-6">
              <div className="mx-auto max-w-4xl">
                <div className="mb-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-indigo-300">Bài kiểm tra</p>
                      <h2 className="mt-1 text-lg sm:text-xl font-bold text-white">
                        {currentQuiz?.title || currentLesson?.title}
                      </h2>
                      {!!currentQuiz?.totalQuestions && (
                        <p className="mt-2 text-xs text-indigo-200/80">
                          {currentQuiz.totalQuestions} câu hỏi
                        </p>
                      )}
                    </div>

                    {hasCurrentQuizTimeLimit && (
                      <div className={`rounded-xl border px-3 py-2 text-right ${
                        isCurrentQuizTimeExpired
                          ? "border-red-400/40 bg-red-500/20"
                          : "border-indigo-400/30 bg-indigo-900/30"
                      }`}>
                        <p className="text-[11px] uppercase tracking-wide text-indigo-200/80">Thời gian còn lại</p>
                        <p className={`text-lg font-extrabold ${
                          isCurrentQuizTimeExpired ? "text-red-200" : "text-white"
                        }`}>
                          {formatCountdown(currentQuizTimeRemaining)}
                        </p>
                      </div>
                    )}
                  </div>

                  {isCurrentQuizTimeExpired && (
                    <p className="mt-3 text-xs font-semibold text-red-200">
                      Đã hết thời gian làm bài.
                    </p>
                  )}
                </div>

                {isQuizLoading && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
                    Đang tải nội dung quiz...
                  </div>
                )}

                {!isQuizLoading && !!quizError && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
                    {quizError}
                  </div>
                )}

                {!isQuizLoading && !quizError && currentQuiz && (
                  <div className="space-y-4">
                    {currentQuiz.questions.map((question, questionIndex) => {
                      const questionAnswer = currentQuizAnswerMap[String(question.id)] || {};
                      const isEssay = isEssayQuestionType(question.questionType);

                      return (
                        <div
                          key={`${currentQuiz.id}-${question.id}`}
                          className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-5"
                        >
                          <p className="text-sm font-semibold text-white">
                            Câu {questionIndex + 1}: {question.content}
                          </p>

                          {isEssay ? (
                            <textarea
                              value={questionAnswer.essayAnswer || ""}
                              onChange={(event) => handleEssayAnswerChange(question.id, event.target.value)}
                              rows={4}
                              placeholder="Nhập câu trả lời của bạn..."
                              disabled={isQuizInteractionLocked}
                              className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500"
                            />
                          ) : (
                            <div className="mt-3 space-y-2">
                              {question.answers.map((answer) => {
                                const selectedAnswerId = toNumber(questionAnswer.selectedAnswerId, 0);
                                const isSelected = selectedAnswerId === toNumber(answer.id, -1);

                                return (
                                  <button
                                    key={`${question.id}-${answer.id}`}
                                    type="button"
                                    onClick={() => handleSelectQuizAnswer(question.id, answer.id)}
                                    disabled={isQuizInteractionLocked}
                                    className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                                      isSelected
                                        ? "border-indigo-400 bg-indigo-500/20 text-indigo-100"
                                        : "border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
                                    }`}
                                  >
                                    {answer.content}
                                  </button>
                                );
                              })}

                              {!question.answers.length && (
                                <p className="text-xs text-amber-300">
                                  Câu hỏi này chưa có đáp án lựa chọn.
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                      {currentQuizResult ? (
                        <p className="text-sm text-emerald-300">
                          Kết quả gần nhất: {toNumber(currentQuizResult?.score)}/{toNumber(currentQuizResult?.totalQuestions)}
                          {currentQuizResult?.isPassed ? " - Đạt" : " - Chưa đạt"}
                        </p>
                      ) : isCurrentQuizTimeExpired ? (
                        <p className="text-sm text-red-200">
                          Đã hết thời gian làm bài, hệ thống đang chốt kết quả.
                        </p>
                      ) : (
                        <p className="text-sm text-slate-300">
                          Hoàn tất tất cả câu trả lời trước khi nộp bài.
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSubmitQuizAttempt({ forceSubmit: isCurrentQuizTimeExpired })}
                        disabled={
                          isSubmittingCurrentQuiz
                          || isAutoSubmittingCurrentQuiz
                          || isQuizLoading
                          || !currentQuiz.questions.length
                          || (isCurrentQuizTimeExpired && !!currentQuizResult)
                        }
                        className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isAutoSubmittingCurrentQuiz
                          ? "Đang tự động nộp..."
                          : isSubmittingCurrentQuiz
                            ? "Đang nộp bài..."
                            : isCurrentQuizTimeExpired
                              ? "Nộp bài đã hết giờ"
                            : "Nộp quiz"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : currentVideoUrl ? (
            <video
              key={currentLesson?.id}
              className="h-full w-full object-contain bg-black"
              controls
              preload="metadata"
              poster={courseThumbnailUrl || undefined}
              src={currentVideoUrl}
            />
          ) : (
            <div className="relative h-full w-full flex items-center justify-center">
              {!!courseThumbnailUrl && (
                <img
                  src={courseThumbnailUrl}
                  alt={course.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-violet-900/40" />
              <div className="relative text-center px-4">
                <p className="text-white text-base font-semibold">
                  {currentLesson?.type === "quiz"
                    ? "Bài này là quiz"
                    : currentLesson?.type === "document"
                      ? "Bài này là tài liệu"
                      : "Video chưa sẵn sàng"}
                </p>
                <p className="mt-2 text-sm text-white/70">{currentLesson?.title}</p>
                {currentDocumentUrl && (
                  <a
                    href={currentDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Mở tài liệu
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <div
              className="h-full bg-indigo-500 rounded-r transition-all"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-slate-900 border-t border-white/5 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={activeLesson === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Bài trước
          </button>

          <div className="text-center px-2">
            <p className="text-sm font-semibold text-white line-clamp-1">{currentLesson?.title}</p>
            <p className="text-xs text-slate-500">
              Bài {activeLesson + 1} / {allLessons.length}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isCurrentQuizLesson && (
              <button
                onClick={handleMarkCurrentLessonCompleted}
                disabled={isSyncingProgress}
                className="px-3 py-2 rounded-lg text-xs font-semibold text-emerald-200 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSyncingProgress ? "Đang lưu..." : "Đánh dấu hoàn thành"}
              </button>
            )}

            <button
              onClick={goNext}
              disabled={activeLesson === allLessons.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Bài tiếp
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-slate-900 flex-1">
          <div className="flex gap-1 px-4 sm:px-6 pt-4 border-b border-white/5">
            {[
              { id: "notes", label: "Ghi chú" },
              { id: "qa", label: "Hỏi đáp" },
              { id: "resources", label: "Tài liệu" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="px-4 sm:px-6 py-6">
            {activeTab === "notes" && (
              <div>
                <div className="flex gap-3 mb-6">
                  <input
                    type="text"
                    value={noteText}
                    onChange={(event) => setNoteText(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && addNote()}
                    placeholder="Thêm ghi chú tại đây..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    onClick={addNote}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Lưu
                  </button>
                </div>

                {notes.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-8">
                    Chưa có ghi chú nào. Hãy ghi lại những điều quan trọng!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {notes.map((note, index) => (
                      <div
                        key={`${note.timestamp}-${index}`}
                        className="bg-white/5 rounded-xl p-4 border border-white/5"
                      >
                        <p className="text-sm text-slate-300">{note.text}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {note.timestamp} • {note.date}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "qa" && (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">
                  Bạn có thể dùng AI Chat ở góc phải để hỏi nhanh về bài học hiện tại.
                </p>
              </div>
            )}

            {activeTab === "resources" && (
              <div className="space-y-3">
                {[
                  currentVideoUrl
                    ? { name: "Video bài học", type: "VIDEO", url: currentVideoUrl }
                    : null,
                  currentDocumentUrl
                    ? { name: "Tài liệu bài học", type: "DOC", url: currentDocumentUrl }
                    : null,
                  courseThumbnailUrl
                    ? { name: "Thumbnail khóa học", type: "IMG", url: courseThumbnailUrl }
                    : null,
                ]
                  .filter(Boolean)
                  .map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/[0.07] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-bold">
                          {file.type}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-slate-500">Mở trong tab mới</p>
                        </div>
                      </div>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Mở
                      </a>
                    </div>
                  ))}

                {!currentVideoUrl && !currentDocumentUrl && !courseThumbnailUrl && (
                  <p className="text-slate-500 text-sm text-center py-8">
                    Bài học này chưa có tài nguyên đính kèm.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <aside className="w-full lg:w-80 bg-slate-900 border-l border-white/5 flex-shrink-0 lg:h-screen lg:sticky lg:top-0 overflow-y-auto">
        <div className="p-4 border-b border-white/5">
          <h3 className="font-bold text-white text-sm mb-3">{course.title}</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {completedCount}/{allLessons.length}
            </span>
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {course.sections.map((section, sectionIndex) => {
            const sectionStart = sectionStartIndexes[sectionIndex] || 0;

            return (
              <div key={section.id || sectionIndex}>
                <button
                  onClick={() => toggleSection(sectionIndex)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <svg
                      className={`w-3.5 h-3.5 text-slate-500 flex-shrink-0 transition-transform ${expandedSections.includes(sectionIndex) ? "rotate-90" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-sm font-semibold text-slate-300 truncate">{section.title}</span>
                  </div>
                  <span className="text-xs text-slate-500 flex-shrink-0 ml-2">
                    {section.lessons.filter((lesson) => lesson.completed).length}/{section.lessons.length}
                  </span>
                </button>

                {expandedSections.includes(sectionIndex) && (
                  <div>
                    {section.lessons.map((lesson, lessonIndex) => {
                      const lessonGlobalIndex = sectionStart + lessonIndex;
                      const isActive = lessonGlobalIndex === activeLesson;

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => goToLesson(lessonGlobalIndex)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 pl-10 text-left transition-all ${
                            isActive
                              ? "bg-indigo-500/10 border-l-2 border-indigo-500"
                              : "hover:bg-white/[0.02] border-l-2 border-transparent"
                          }`}
                        >
                          {lesson.completed ? (
                            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : lesson.type === "quiz" ? (
                            <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          ) : lesson.type === "document" ? (
                            <svg className="w-4 h-4 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V7l-5-5H7a2 2 0 00-2 2v15a2 2 0 002 2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className={`text-xs truncate ${isActive ? "text-indigo-400 font-semibold" : "text-slate-400"}`}>
                              {lesson.title}
                            </p>
                          </div>

                          <span className="text-[10px] text-slate-600 flex-shrink-0">{lesson.duration}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      <ChatbotWidget context={chatbotContext} />
    </div>
  );
};

export default LearningPlayer;