import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import courseApi from "../../../api/courseApi";
import fileUploadApi from "../../../api/fileUploadApi";
import lessonApi from "../../../api/lessonApi";
import quizApi from "../../../api/quizApi";
import sectionApi from "../../../api/sectionApi";

const LESSON_TYPES = [
  {
    value: "VIDEO",
    label: "Video bài giảng",
    icon: "▶",
    description: "Upload video, có thể cho học thử.",
  },
  {
    value: "DOCUMENT",
    label: "Tài liệu",
    icon: "DOC",
    description: "PDF, Word, slide hoặc tài liệu tải về.",
  },
  {
    value: "TEXT",
    label: "Bài quiz",
    icon: "QZ",
    description: "Bài luyện tập ngắn trong chương.",
  },
  {
    value: "QUIZ",
    label: "Bài kiểm tra",
    icon: "TEST",
    description: "Bài đánh giá có thể gán đề thi.",
  },
];

const PREVIEW_SUPPORTED_TYPES = ["VIDEO", "DOCUMENT"];
const ASSESSMENT_TYPES = ["TEXT", "QUIZ"];

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
  });

  const [existingLesson, setExistingLesson] = useState(null);
  const [courseContext, setCourseContext] = useState(null);
  const [sectionContext, setSectionContext] = useState(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingLesson, setIsLoadingLesson] = useState(false);

  // Quiz state
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(false);
  const [selectedQuizIds, setSelectedQuizIds] = useState([]);

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
  const supportsPreview = PREVIEW_SUPPORTED_TYPES.includes(
    lessonData.lessonType,
  );
  const usesAssessment = ASSESSMENT_TYPES.includes(lessonData.lessonType);
  const selectedLessonType =
    LESSON_TYPES.find((type) => type.value === lessonData.lessonType) ||
    LESSON_TYPES[0];

  useEffect(() => {
    if (!hasValidContext) return;
    let isMounted = true;

    const loadBreadcrumbContext = async () => {
      try {
        setIsLoadingContext(true);
        const [courseResponse, sectionResponse] = await Promise.all([
          courseApi.getCourseById(courseId),
          sectionApi.getSectionsByCourse(courseId),
        ]);

        if (!isMounted) return;

        const course = courseResponse?.data?.result || null;
        const sections = sectionResponse?.data?.result || [];
        const section = sections.find((item) => item.id === sectionId) || null;

        setCourseContext(course);
        setSectionContext(section);
      } catch (error) {
        console.error(
          "Failed to load lesson breadcrumb context:",
          error?.response?.data || error,
        );
      } finally {
        if (isMounted) setIsLoadingContext(false);
      }
    };

    loadBreadcrumbContext();
    return () => {
      isMounted = false;
    };
  }, [courseId, hasValidContext, sectionId]);

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
    if (!usesAssessment) return;
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
  }, [existingLesson, isEditMode, lessonId, usesAssessment]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
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

  const handleChangeLessonType = (nextType) => {
    setLessonData((prev) => ({
      ...prev,
      lessonType: nextType,
      isPreview: PREVIEW_SUPPORTED_TYPES.includes(nextType)
        ? prev.isPreview
        : false,
    }));

    if (!PREVIEW_SUPPORTED_TYPES.includes(nextType)) {
      setSelectedFile(null);
    }
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
          isPreview: supportsPreview ? lessonData.isPreview : false,
          sectionId,
          fileUploadId,
          quizIds:
            usesAssessment && selectedQuizIds.length > 0
              ? selectedQuizIds
              : null,
        };

        await lessonApi.updateLesson(lessonId, updatePayload);
        showToast("Đã cập nhật bài học thành công!");
      } else {
        const payload = {
          title: lessonData.title.trim(),
          orderIndex: 0,
          lessonType: lessonData.lessonType,
          durationSeconds: 0,
          isPreview: supportsPreview ? lessonData.isPreview : false,
          sectionId,
          courseId,
          fileUploadId,
          quizIds:
            usesAssessment && selectedQuizIds.length > 0
              ? selectedQuizIds
              : null,
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

  const breadcrumbCourseTitle =
    courseContext?.title || (courseId ? `Khóa học #${courseId}` : "Khóa học");
  const breadcrumbSectionTitle =
    sectionContext?.title || (sectionId ? `Chương #${sectionId}` : "Chương");
  const breadcrumbLessonTitle =
    lessonData.title.trim() || (isEditMode ? `Bài học #${lessonId}` : "Bài học mới");

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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 px-8 py-4 flex justify-between items-center gap-6 shadow-sm">
        <div className="min-w-0">
          <div className="text-xs text-gray-500 mb-2 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => navigate(`${basePath}/courses`)}
              className="font-semibold text-gray-500 hover:text-blue-600"
            >
              Khóa học
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => navigate(`${basePath}/courses/update/${courseId}`)}
              className="max-w-[220px] truncate font-semibold text-gray-700 hover:text-blue-600"
              title={breadcrumbCourseTitle}
            >
              {breadcrumbCourseTitle}
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => navigate(`${basePath}/courses/update/${courseId}`)}
              className="max-w-[180px] truncate font-semibold text-gray-700 hover:text-blue-600"
              title={breadcrumbSectionTitle}
            >
              {breadcrumbSectionTitle}
            </button>
            <span>/</span>
            <span
              className="max-w-[220px] truncate font-bold text-gray-900"
              title={breadcrumbLessonTitle}
            >
              {breadcrumbLessonTitle}
            </span>
            {isLoadingContext && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                Đang tải map...
              </span>
            )}
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

      <div className="max-w-5xl mx-auto px-8 pt-8 space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Thông tin bài học
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Chọn loại nội dung trước, các cấu hình không liên quan sẽ tự ẩn.
              </p>
            </div>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {selectedLessonType.label}
            </span>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">
              Tên bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập tên bài học"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 text-sm font-medium text-gray-800"
              value={lessonData.title}
              onChange={(e) => setLessonData((prev) => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Loại bài học
            </label>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                {LESSON_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleChangeLessonType(type.value)}
                    className={`rounded-xl border-2 p-4 text-left transition-all ${
                      lessonData.lessonType === type.value
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-xs font-black ${
                        lessonData.lessonType === type.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {type.icon}
                    </span>
                    <span className="mt-3 block text-sm font-bold text-gray-900">
                      {type.label}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500">
                      {type.description}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {supportsPreview && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <label className="flex cursor-pointer items-center justify-between gap-4">
                <span>
                  <span className="block text-sm font-bold text-emerald-800">
                    Cho phép xem trước
                  </span>
                  <span className="block text-xs leading-5 text-emerald-700/80">
                    Học viên có thể xem thử video hoặc tài liệu trước khi đăng
                    ký khóa học.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={lessonData.isPreview}
                  onChange={(e) => setLessonData((prev) => ({ ...prev, isPreview: e.target.checked }))}
                  className="h-5 w-5 rounded border-emerald-300"
                />
              </label>
            </div>
          )}
        </div>

        {/* File Upload Section - show for VIDEO and DOCUMENT types */}
        {(lessonData.lessonType === "VIDEO" || lessonData.lessonType === "DOCUMENT") && (
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {lessonData.lessonType === "VIDEO"
                    ? "Nội dung video"
                    : "Tệp tài liệu"}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {lessonData.lessonType === "VIDEO"
                    ? "Upload video bài giảng cho bài học này."
                    : "Upload tài liệu để học viên xem hoặc tải về."}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {lessonData.lessonType === "VIDEO" ? "VIDEO" : "DOCUMENT"}
              </span>
            </div>

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
              <label className="block text-sm font-bold text-gray-700 mb-2">
                {isEditMode ? "Thay thế tệp (để trống nếu giữ nguyên)" : "Tải lên tệp"}
              </label>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center transition-colors hover:border-blue-400 hover:bg-blue-50/40">
                <span className="text-sm font-bold text-gray-800">
                  {selectedFile ? selectedFile.name : "Chọn tệp từ máy tính"}
                </span>
                <span className="mt-1 text-xs text-gray-500">
                  {lessonData.lessonType === "VIDEO"
                    ? "Hỗ trợ video mp4, webm, avi..."
                    : "Hỗ trợ PDF, Word, PowerPoint..."}
                </span>
                <input
                  type="file"
                  accept={lessonData.lessonType === "VIDEO" ? "video/*" : ".pdf,.ppt,.pptx,.doc,.docx"}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {selectedFile && (
                <div className="mt-3 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm">
                  <span className="min-w-0 truncate font-medium text-blue-800">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="ml-3 text-xs font-bold text-blue-600 hover:text-red-600"
                  >
                    Bỏ chọn
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {usesAssessment && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                {lessonData.lessonType === "TEXT"
                  ? "Nội dung bài quiz"
                  : "Nội dung bài kiểm tra"}
                {selectedQuizIds.length > 0 && (
                  <span className="ml-2 text-sm font-normal text-blue-600">
                    ({selectedQuizIds.length} đã chọn)
                  </span>
                )}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Chọn đề có sẵn từ kho đề thi để gán vào bài học này.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  navigate(`${basePath}/quiz`, {
                    state: {
                      returnTo: `${location.pathname}${location.search}`,
                    },
                  })
                }
                className="px-3 py-1.5 text-xs font-bold text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Sang kho đề thi →
              </button>
            </div>
          </div>

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
        )}
      </div>
    </div>
  );
};

export default CreateLesson;
