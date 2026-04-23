import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import fileUploadApi from "../../../api/fileUploadApi";
import lessonApi from "../../../api/lessonApi";
import quizApi from "../../../api/quizApi";

const LESSON_TYPES = [
  { value: "VIDEO", label: "Video bài giảng", icon: "▶" },
  { value: "DOCUMENT", label: "Tài liệu", icon: "📄" },
  { value: "QUIZ", label: "Bài kiểm tra", icon: "✓" },
];

const CreateLesson = () => {
  const [searchParams] = useSearchParams();
  const courseId = Number(searchParams.get("courseId"));
  const sectionId = Number(searchParams.get("sectionId"));
  const lessonIdParam = searchParams.get("lessonId");
  const lessonId = lessonIdParam ? Number(lessonIdParam) : null;
  const defaultType = (searchParams.get("type") || "VIDEO").toUpperCase();

  const isEditMode = lessonId !== null && Number.isFinite(lessonId);

  const [lessonData, setLessonData] = useState({
    title: "",
    preview: false,
    lessonType: LESSON_TYPES.some((item) => item.value === defaultType) ? defaultType : "VIDEO",
  });

  const [existingLesson, setExistingLesson] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  // Quiz state
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [selectedQuizIds, setSelectedQuizIds] = useState([]);
  const [isCreatingQuiz, setIsCreatingQuiz] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [showQuickCreate, setShowQuickCreate] = useState(false);

  const [toast, setToast] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/instructor")
    ? "/instructor"
    : "/admin";

  const hasValidContext = useMemo(
    () => Number.isFinite(courseId) && Number.isFinite(sectionId),
    [courseId, sectionId]
  );

  // Load existing lesson data when in edit mode
  useEffect(() => {
    if (!isEditMode || !sectionId) return;
    let isMounted = true;

    const loadLessonData = async () => {
      try {
        setIsLoadingLesson(true);
        const response = await lessonApi.getLessonsBySectionId(sectionId);
        const sectionData = response?.data?.result;
        const lessons = sectionData?.lessons || [];
        const lesson = lessons.find((l) => l.id === lessonId);

        if (!isMounted) return;

        if (lesson) {
          setExistingLesson(lesson);
          setLessonData({
            title: lesson.title || "",
            preview: lesson.preview || lesson.preview || false,
            lessonType: lesson.lessonType || defaultType,
          });
          // Set selected quiz IDs from existing lesson
          const existingQuizIds = (lesson.quizzes || []).map((q) => q.id);
          setSelectedQuizIds(existingQuizIds);
        }
      } catch (error) {
        console.error("Failed to load lesson:", error?.response?.data || error);
      } finally {
        if (isMounted) setIsLoadingLesson(false);
      }
    };

    loadLessonData();
    return () => { isMounted = false; };
  }, [isEditMode, lessonId, sectionId, defaultType]);

  // Fetch all quizzes
  useEffect(() => {
    let isMounted = true;

    const loadQuizzes = async () => {
      try {
        setIsLoadingQuizzes(true);
        const response = await quizApi.getAllQuizzes();
        const rawList = response?.data?.result || response?.data || [];
        const list = Array.isArray(rawList) ? rawList : rawList?.content || [];

        if (!isMounted) return;

        // Only show quizzes that are unassigned OR already belong to current lesson
        const currentQuizIds = (existingLesson?.quizzes || []).map((q) => q.id);
        const visible = list.filter((quiz) => {
          const quizLessonId = quiz.lessonId || quiz.lesson_id || null;
          if (!quizLessonId) return true; // unassigned
          if (isEditMode && currentQuizIds.includes(quiz.id)) return true; // belongs to this lesson
          return false; // assigned to another lesson
        });

        setAllQuizzes(visible);
      } catch (error) {
        console.error("Failed to load quizzes:", error?.response?.data || error);
        if (isMounted) setAllQuizzes([]);
      } finally {
        if (isMounted) setIsLoadingQuizzes(false);
      }
    };

    loadQuizzes();
    return () => { isMounted = false; };
  }, [existingLesson, isEditMode, lessonId]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Quick create quiz inline
  const handleQuickCreateQuiz = async () => {
    if (!newQuizTitle.trim()) {
      showToast("Vui lòng nhập tên bài kiểm tra", "error");
      return;
    }
    try {
      setIsCreatingQuiz(true);
      const payload = {
        title: newQuizTitle.trim(),
        timeLimitMin: 30,
        passScore: 1,
        shuffleQuestions: false,
        shuffleAnswers: false,
        manualQuestions: [],
      };
      const resp = await quizApi.createQuiz(payload);
      const newQuiz = resp?.data?.result;
      if (newQuiz?.id) {
        setAllQuizzes((prev) => [...prev, newQuiz]);
        setSelectedQuizIds((prev) => [...prev, newQuiz.id]);
        showToast("Đã tạo bài kiểm tra! Bạn có thể thêm câu hỏi sau.");
        setNewQuizTitle("");
        setShowQuickCreate(false);
      }
    } catch (err) {
      console.error("Quick create quiz failed:", err);
      showToast(err?.response?.data?.message || "Tạo quiz thất bại", "error");
    } finally {
      setIsCreatingQuiz(false);
    }
  };

  const toggleQuizSelection = (quizId) => {
    setSelectedQuizIds((prev) =>
      prev.includes(quizId)
        ? prev.filter((id) => id !== quizId)
        : [...prev, quizId]
    );
  };

  const resolveFileType = () => {
    if (lessonData.lessonType === "VIDEO") return "VIDEO";
    return "DOCUMENT";
  };

  const handleSave = async () => {
    if (!hasValidContext) {
      showToast("Thiếu courseId hoặc sectionId.", "error");
      return;
    }

    if (!lessonData.title.trim()) {
      showToast("Vui lòng nhập tên bài học.", "error");
      return;
    }

    let fileUploadId = null;

    try {
      setIsSaving(true);

      // Upload file if selected (for VIDEO or DOCUMENT)
      if (
        (lessonData.lessonType === "VIDEO" || lessonData.lessonType === "DOCUMENT") &&
        selectedFile
      ) {
        const uploadResponse = await fileUploadApi.uploadFiles({
          files: [selectedFile],
          fileType: resolveFileType(),
          folderName: "btm-learning/lessons",
        });

        const uploaded = uploadResponse?.data?.result || [];
        fileUploadId = uploaded[0]?.id;

        if (!fileUploadId) {
          throw new Error("File upload did not return file id");
        }
      }

      if (isEditMode) {
        const updatePayload = {
          title: lessonData.title.trim(),
          orderIndex: existingLesson?.orderIndex || 0,
          lessonType: lessonData.lessonType,
          durationSeconds: 0,
          preview: lessonData.preview,
          sectionId,
          fileUploadId,
          quizId: selectedQuizIds.length > 0 ? selectedQuizIds[0] : null,
        };

        await lessonApi.updateLesson(lessonId, updatePayload);
        showToast("Đã cập nhật bài học thành công!");
      } else {
        const payload = {
          title: lessonData.title.trim(),
          orderIndex: 0,
          lessonType: lessonData.lessonType,
          durationSeconds: 0,
          preview: lessonData.preview,
          sectionId,
          courseId,
          fileUploadId,
          quizId: selectedQuizIds.length > 0 ? selectedQuizIds[0] : null,
        };

        await lessonApi.createLesson(payload);
        showToast("Đã tạo bài học thành công!");
      }

      setTimeout(() => navigate(`${basePath}/courses/update/${courseId}`), 800);
    } catch (error) {
      console.error("Save lesson failed:", error?.response?.data || error);
      showToast(error?.response?.data?.message || "Lưu bài học thất bại", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const pageTitle = isEditMode
    ? `Gán nội dung: ${lessonData.title || "Bài học"}`
    : "Tạo bài học mới";

  if (isLoadingLesson) {
    return (
      <div className="bg-gray-50 min-h-screen pb-12 font-sans">
        <div className="max-w-4xl mx-auto px-8 pt-16">
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center text-sm text-gray-500">
            Đang tải thông tin bài học...
          </div>
        </div>
      </div>
    );
  }

  const selectedQuizzes = allQuizzes.filter((q) => selectedQuizIds.includes(q.id));
  const availableQuizzes = allQuizzes.filter((q) => !selectedQuizIds.includes(q.id));

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
            <span>Khóa học</span> <span>/</span> <span>Chương</span> <span>/</span>
            <span className="font-semibold text-gray-700">Bài học</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 font-serif">{pageTitle}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`${basePath}/courses/update/${courseId}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Quay lại khóa học
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-70"
          >
            {isSaving ? "Đang lưu..." : isEditMode ? "Cập nhật bài học" : "Tạo bài học"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-8 space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Thông tin cơ bản</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên bài học"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
              value={lessonData.title}
              onChange={(e) => setLessonData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="flex gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại bài học</label>
              <div className="flex gap-2">
                {LESSON_TYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setLessonData((prev) => ({ ...prev, lessonType: type.value }))}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${lessonData.lessonType === type.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                  >
                    <span className="mr-1">{type.icon}</span> {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={lessonData.preview}
                  onChange={(e) => setLessonData((prev) => ({ ...prev, preview: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300"
                />
                Cho phép xem trước
              </label>
            </div>
          </div>
        </div>

        {/* File Upload Section - show for VIDEO and DOCUMENT types */}
        {(lessonData.lessonType === "VIDEO" || lessonData.lessonType === "DOCUMENT") && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-800">
              {lessonData.lessonType === "VIDEO" ? "📹 Video bài giảng" : "📄 Tài liệu"}
            </h2>

            {/* Show existing content */}
            {isEditMode && (
              <div className="text-sm">
                {lessonData.lessonType === "VIDEO" && existingLesson?.videoUrl && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <span>✓</span>
                    <span>Đã có video: <span className="font-medium">{existingLesson.videoUrl.split("/").pop()}</span></span>
                  </div>
                )}
                {lessonData.lessonType === "DOCUMENT" && existingLesson?.documentUrl && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <span>✓</span>
                    <span>Đã có tài liệu: <span className="font-medium">{existingLesson.documentUrl.split("/").pop()}</span></span>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {isEditMode ? "Thay thế tệp (để trống nếu giữ nguyên)" : "Tải lên tệp"}
              </label>
              <input
                type="file"
                accept={lessonData.lessonType === "VIDEO" ? "video/*" : ".pdf,.ppt,.pptx,.doc,.docx"}
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                {lessonData.lessonType === "VIDEO"
                  ? "Chấp nhận video: mp4, webm, avi..."
                  : "Chấp nhận: PDF, Word, PowerPoint..."}
              </p>
            </div>
          </div>
        )}

        {/* Quiz Section - always show for all lesson types */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">
              ✓ Bài kiểm tra
              {selectedQuizIds.length > 0 && (
                <span className="ml-2 text-sm font-normal text-blue-600">
                  ({selectedQuizIds.length} đã chọn)
                </span>
              )}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowQuickCreate(!showQuickCreate)}
                className="px-3 py-1.5 text-xs font-bold text-emerald-600 border border-emerald-300 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                {showQuickCreate ? "Ẩn" : "+ Tạo quiz mới"}
              </button>
              <button
                onClick={() => navigate(`${basePath}/quiz`)}
                className="px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Quản lý đề thi →
              </button>
            </div>
          </div>

          {/* Quick create quiz */}
          {showQuickCreate && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3">
              <label className="block text-sm font-bold text-blue-800">Tạo nhanh bài kiểm tra</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tên bài kiểm tra..."
                  value={newQuizTitle}
                  onChange={(e) => setNewQuizTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickCreateQuiz()}
                  className="flex-1 border border-blue-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleQuickCreateQuiz}
                  disabled={isCreatingQuiz}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-70 whitespace-nowrap"
                >
                  {isCreatingQuiz ? "Đang tạo..." : "Tạo"}
                </button>
              </div>
              <p className="text-xs text-blue-600">Quiz sẽ được tạo trống và tự động chọn. Thêm câu hỏi từ trang quản lý đề thi.</p>
            </div>
          )}

          {/* Selected quizzes */}
          {selectedQuizzes.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Đã chọn:</label>
              {selectedQuizzes.map((quiz, idx) => (
                <div key={quiz.id} className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-xs font-bold text-blue-400 w-5">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-blue-800 truncate">{quiz.title || `Quiz #${quiz.id}`}</p>
                    <p className="text-xs text-blue-600">
                      {quiz.totalQuestions || quiz.questions?.length || "?"} câu hỏi
                      {quiz.timeLimitMin ? ` • ${quiz.timeLimitMin} phút` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleQuizSelection(quiz.id)}
                    className="p-1.5 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    title="Bỏ chọn"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Available quizzes */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">
              Tất cả bài kiểm tra ({isLoadingQuizzes ? "..." : availableQuizzes.length}):
            </label>
            {isLoadingQuizzes ? (
              <div className="text-sm text-gray-400 py-4 text-center">Đang tải danh sách bài kiểm tra...</div>
            ) : availableQuizzes.length === 0 ? (
              <div className="text-sm text-gray-400 py-4 text-center border border-dashed border-gray-300 rounded-lg">
                Không có bài kiểm tra nào khả dụng. Hãy tạo mới!
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                {availableQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    onClick={() => toggleQuizSelection(quiz.id)}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all group"
                  >
                    <div className="w-5 h-5 rounded border-2 border-gray-300 group-hover:border-blue-500 flex items-center justify-center shrink-0">
                      {selectedQuizIds.includes(quiz.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{quiz.title || `Quiz #${quiz.id}`}</p>
                      <p className="text-xs text-gray-500">
                        {quiz.totalQuestions || quiz.questions?.length || "?"} câu
                        {quiz.timeLimitMin ? ` • ${quiz.timeLimitMin} phút` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-blue-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      + Chọn
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;
