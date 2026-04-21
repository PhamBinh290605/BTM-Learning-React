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
    isPreview: false,
    lessonType: LESSON_TYPES.some((item) => item.value === defaultType) ? defaultType : "VIDEO",
    quizId: "",
  });

  const [existingLesson, setExistingLesson] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);

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
            isPreview: lesson.isPreview || lesson.preview || false,
            lessonType: lesson.lessonType || defaultType,
            quizId: lesson.quizzes?.[0]?.id ? String(lesson.quizzes[0].id) : "",
          });
        }
      } catch (error) {
        console.error("Failed to load lesson:", error?.response?.data || error);
      } finally {
        if (isMounted) setIsLoadingLesson(false);
      }
    };

    loadLessonData();

    return () => {
      isMounted = false;
    };
  }, [isEditMode, lessonId, sectionId, defaultType]);

  // Fetch quiz list when type = QUIZ — only show quizzes NOT assigned to any lesson
  useEffect(() => {
    if (lessonData.lessonType !== "QUIZ") return;

    let isMounted = true;

    const loadQuizzes = async () => {
      try {
        setIsLoadingQuizzes(true);
        const response = await quizApi.getAllQuizzes();
        const rawList = response?.data?.result || response?.data || [];
        const list = Array.isArray(rawList) ? rawList : rawList?.content || [];

        if (!isMounted) return;

        // Only show quizzes that are NOT yet assigned to any lesson,
        // OR already assigned to THIS lesson (so user can re-select it)
        const currentQuizId = existingLesson?.quizzes?.[0]?.id;
        const filtered = list.filter((quiz) => {
          const quizLessonId = quiz.lessonId || quiz.lesson_id || null;
          if (!quizLessonId) return true; // Not assigned to any lesson
          if (isEditMode && quizLessonId === lessonId) return true; // Assigned to current lesson
          if (isEditMode && currentQuizId && quiz.id === currentQuizId) return true;
          return false;
        });

        setQuizList(filtered);
      } catch (error) {
        console.error("Failed to load quizzes:", error?.response?.data || error);
        if (!isMounted) return;
        setQuizList([]);
      } finally {
        if (isMounted) setIsLoadingQuizzes(false);
      }
    };

    loadQuizzes();

    return () => {
      isMounted = false;
    };
  }, [lessonData.lessonType, existingLesson, isEditMode, lessonId]);

  const resolveFileType = () => {
    if (lessonData.lessonType === "VIDEO") return "VIDEO";
    return "DOCUMENT";
  };

  const handleSave = async () => {
    if (!hasValidContext) {
      alert("Thiếu courseId hoặc sectionId. Vui lòng quay lại màn tạo khóa học.");
      return;
    }

    if (!lessonData.title.trim()) {
      alert("Vui lòng nhập tên bài học.");
      return;
    }

    let fileUploadId = null;

    try {
      setIsSaving(true);

      // Upload file if needed (VIDEO or DOCUMENT types) and a file is selected
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

      // Validate quiz selection for QUIZ type
      if (lessonData.lessonType === "QUIZ" && !lessonData.quizId) {
        alert("Vui lòng chọn bài kiểm tra.");
        return;
      }

      if (isEditMode) {
        // Update existing lesson — file is optional (keeps old content if not uploaded)
        const updatePayload = {
          title: lessonData.title.trim(),
          orderIndex: existingLesson?.orderIndex || 0,
          lessonType: lessonData.lessonType,
          durationSeconds: 0,
          isPreview: lessonData.isPreview,
          sectionId,
          fileUploadId,
          quizId:
            lessonData.lessonType === "QUIZ" ? Number(lessonData.quizId) : null,
        };

        await lessonApi.updateLesson(lessonId, updatePayload);
        alert("Đã cập nhật nội dung bài học thành công!");
      } else {
        // Create new lesson — file is optional for initial creation
        const payload = {
          title: lessonData.title.trim(),
          orderIndex: 0,
          lessonType: lessonData.lessonType,
          durationSeconds: 0,
          isPreview: lessonData.isPreview,
          sectionId,
          courseId,
          fileUploadId,
          quizId:
            lessonData.lessonType === "QUIZ" ? Number(lessonData.quizId) : null,
        };

        await lessonApi.createLesson(payload);
        alert("Đã tạo bài học thành công!");
      }

      navigate(`${basePath}/courses/update/${courseId}`);
    } catch (error) {
      console.error("Save lesson failed:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Lưu bài học thất bại");
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

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            <span>Khóa học #{courseId || "--"}</span>
            <span>/</span>
            <span>Chương #{sectionId || "--"}</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              {isEditMode ? "Gán nội dung" : "Tạo bài học"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            {pageTitle}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`${basePath}/courses/update/${courseId}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm disabled:opacity-70"
          >
            {isSaving
              ? "Đang lưu..."
              : isEditMode
              ? "Cập nhật bài học"
              : "Lưu bài học"}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-8 space-y-6">
        {/* Existing content indicator for edit mode */}
        {isEditMode && existingLesson && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-sm font-bold text-blue-800 mb-2">
              Thông tin hiện tại
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs text-blue-700">
              <div>
                <span className="font-medium">Loại:</span>{" "}
                {existingLesson.lessonType}
              </div>
              <div>
                <span className="font-medium">Video:</span>{" "}
                {existingLesson.videoUrl ? "✓ Đã có" : "Chưa có"}
              </div>
              <div>
                <span className="font-medium">Tài liệu:</span>{" "}
                {existingLesson.documentUrl ? "✓ Đã có" : "Chưa có"}
              </div>
              <div>
                <span className="font-medium">Quiz:</span>{" "}
                {existingLesson.quizzes?.length > 0
                  ? `✓ ${existingLesson.quizzes.length} bài`
                  : "Chưa có"}
              </div>
            </div>
            {(existingLesson.videoUrl || existingLesson.documentUrl) && (
              <p className="text-xs text-blue-600 mt-2 font-medium">
                💡 Upload file mới sẽ thay thế nội dung cũ. Để giữ nguyên,
                không cần chọn file.
              </p>
            )}
          </div>
        )}

        {/* Basic info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Tên bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={lessonData.title}
              onChange={(event) =>
                setLessonData((prev) => ({ ...prev, title: event.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
              placeholder="VD: Bài 1 - Giới thiệu"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Loại bài học
              </label>
              <select
                value={lessonData.lessonType}
                onChange={(event) =>
                  setLessonData((prev) => ({
                    ...prev,
                    lessonType: event.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
              >
                {LESSON_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end pb-2">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={lessonData.isPreview}
                  onChange={(event) =>
                    setLessonData((prev) => ({
                      ...prev,
                      isPreview: event.target.checked,
                    }))
                  }
                />
                Cho phép xem thử (Preview)
              </label>
            </div>
          </div>
        </div>

        {/* Content assignment */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-gray-800">
            Nội dung bài học
          </h3>

          {lessonData.lessonType === "QUIZ" ? (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Chọn bài kiểm tra{" "}
                {!isEditMode && <span className="text-red-500">*</span>}
              </label>
              {isLoadingQuizzes ? (
                <div className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm text-gray-400">
                  Đang tải danh sách bài kiểm tra...
                </div>
              ) : quizList.length === 0 ? (
                <div>
                  <div className="w-full border border-amber-300 bg-amber-50 rounded-lg px-4 py-3 text-sm text-amber-700">
                    Không có bài kiểm tra nào chưa được gán. Vui lòng tạo bài
                    kiểm tra mới trước.
                  </div>
                  <button
                    onClick={() => navigate(`${basePath}/quiz`)}
                    className="mt-2 text-sm text-blue-600 font-medium hover:text-blue-800"
                  >
                    → Đi đến trang tạo bài kiểm tra
                  </button>
                </div>
              ) : (
                <select
                  value={lessonData.quizId}
                  onChange={(event) =>
                    setLessonData((prev) => ({
                      ...prev,
                      quizId: event.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
                >
                  <option value="">-- Chọn bài kiểm tra --</option>
                  {quizList.map((quiz) => (
                    <option key={quiz.id} value={quiz.id}>
                      {quiz.title || `Quiz #${quiz.id}`} (
                      {quiz.totalQuestions || "?"} câu)
                    </option>
                  ))}
                </select>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Chỉ hiển thị các bài kiểm tra chưa được gán vào bài học nào.
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Tệp nội dung{" "}
                <span className="text-xs font-normal text-gray-400">
                  {isEditMode
                    ? "(không bắt buộc — để trống nếu giữ nguyên)"
                    : "(không bắt buộc — có thể gán sau)"}
                </span>
              </label>
              <input
                type="file"
                accept={
                  lessonData.lessonType === "VIDEO"
                    ? "video/*"
                    : ".pdf,.ppt,.pptx,.doc,.docx"
                }
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] || null)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                {lessonData.lessonType === "VIDEO"
                  ? "Chấp nhận các định dạng video phổ biến (mp4, webm, avi...)"
                  : "Chấp nhận PDF, Word, PowerPoint..."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateLesson;
