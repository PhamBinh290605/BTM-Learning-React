import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import courseApi from "../../../api/courseApi";
import fileUploadApi from "../../../api/fileUploadApi";
import lessonApi from "../../../api/lessonApi";
import sectionApi from "../../../api/sectionApi";
import { resolveMediaUrl } from "../../../utils/media";

const LEVEL_OPTIONS = [
  { value: "BEGINNER", label: "Cơ bản (Người mới bắt đầu)" },
  { value: "INTERMEDIATE", label: "Trung bình (Đã có nền tảng)" },
  { value: "ADVANCED", label: "Nâng cao (Chuyên gia)" },
];

const STATUS_OPTIONS = [
  { value: "DRAFT", label: "Bản nháp" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "ACTIVE", label: "Đang xuất bản" },
  { value: "ARCHIVED", label: "Đã lưu trữ" },
  { value: "INACTIVE", label: "Ngừng hoạt động" },
];

const LESSON_TYPE_CONFIG = {
  VIDEO: { icon: "▶", label: "Video", color: "text-blue-600 bg-blue-100" },
  DOCUMENT: {
    icon: "📄",
    label: "Tài liệu",
    color: "text-amber-600 bg-amber-100",
  },
  TEXT: { icon: "📝", label: "Văn bản", color: "text-gray-600 bg-gray-100" },
  QUIZ: {
    icon: "✓",
    label: "Bài kiểm tra",
    color: "text-purple-600 bg-purple-100",
  },
};

const toDateTimeLocal = (value) => {
  if (!value) return "";

  return String(value).replace(" ", "T").slice(0, 16);
};

const toIsoDateTime = (value) => {
  if (!value) return null;

  return value.length === 16 ? `${value}:00` : value;
};

const CreateCourse = () => {
  const { id } = useParams();
  const courseId = Number(id);

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [error, setError] = useState("");
  const [pendingThumbnailUploadId, setPendingThumbnailUploadId] =
    useState(null);

  const [categories, setCategories] = useState([]);
  const [chapters, setChapters] = useState([]);

  // State for inline lesson creation
  const [newLessonInputs, setNewLessonInputs] = useState({});
  const [newLessonTypes, setNewLessonTypes] = useState({});
  const [creatingLessonForSection, setCreatingLessonForSection] = useState(null);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [editingLessonTitle, setEditingLessonTitle] = useState("");
  const [toast, setToast] = useState(null);

  const [courseInfo, setCourseInfo] = useState({
    title: "",
    slug: "",
    categoryId: "",
    level: "BEGINNER",
    isFree: false,
    originalPrice: "",
    salePrice: "",
    discountEndDate: "",
    campaignName: "",
    description: "",
    status: "DRAFT",
    thumbnailUrl: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/instructor")
    ? "/instructor"
    : "/admin";

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const [courseResponse, categoryResponse, sectionResponse] =
        await Promise.all([
          courseApi.getCourseById(courseId),
          categoryApi.getCategories(),
          sectionApi.getSectionsByCourse(courseId),
        ]);

      const course = courseResponse?.data?.result;
      const fetchedCategories = categoryResponse?.data?.result || [];
      const fetchedSections = sectionResponse?.data?.result || [];
      const originalPrice = Number(course?.originalPrice ?? course?.price ?? 0);
      const currentPrice = Number(course?.price ?? 0);
      const hasSalePrice =
        currentPrice > 0 && originalPrice > 0 && currentPrice < originalPrice;

      setCategories(fetchedCategories);
      setCourseInfo({
        title: course?.title || "",
        slug: course?.slug || `course-${courseId}`,
        categoryId: course?.category?.id || "",
        level: course?.level || "BEGINNER",
        isFree: originalPrice <= 0,
        originalPrice: originalPrice <= 0 ? "" : String(originalPrice),
        salePrice: hasSalePrice ? String(currentPrice) : "",
        discountEndDate: toDateTimeLocal(course?.discountEndDate),
        campaignName: course?.campaignName || "",
        description: course?.description || "",
        status: course?.status || "DRAFT",
        thumbnailUrl: course?.thumbnailUrl || "",
      });
      setPendingThumbnailUploadId(null);

      setChapters(
        fetchedSections.map((section) => ({
          id: section.id,
          title: section.title,
          orderIndex: section.orderIndex,
          isExpanded: true,
          lessons: (section.lessons || []).sort(
            (a, b) => a.orderIndex - b.orderIndex,
          ),
        })),
      );
    } catch (loadError) {
      console.error(
        "Failed to load course editor data:",
        loadError?.response?.data || loadError,
      );
      setError(
        loadError?.response?.data?.message || "Không thể tải dữ liệu khóa học.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (!Number.isFinite(courseId)) {
      setError("Khóa học không hợp lệ.");
      setIsLoading(false);
      return;
    }

    loadData();
  }, [courseId, loadData]);

  const sortedChapters = useMemo(() => {
    return [...chapters].sort(
      (left, right) => left.orderIndex - right.orderIndex,
    );
  }, [chapters]);

  const handleSaveCourse = async (nextStatus) => {
    if (!courseInfo.title.trim()) {
      alert("Vui lòng nhập tên khóa học.");
      return;
    }

    if (!courseInfo.categoryId) {
      alert("Vui lòng chọn danh mục.");
      return;
    }

    const originalPrice = courseInfo.isFree
      ? 0
      : Number(courseInfo.originalPrice || 0);
    if (!courseInfo.isFree && originalPrice <= 0) {
      alert("Giá gốc phải lớn hơn 0 hoặc bật chế độ miễn phí.");
      return;
    }

    const salePrice = Number(courseInfo.salePrice || 0);
    const hasInputSalePrice = String(courseInfo.salePrice || "").trim() !== "";

    if (!courseInfo.isFree && hasInputSalePrice && salePrice >= originalPrice) {
      alert("Giá sale phải nhỏ hơn giá gốc.");
      return;
    }

    if (
      !courseInfo.isFree &&
      hasInputSalePrice &&
      !courseInfo.discountEndDate
    ) {
      alert("Vui lòng chọn hạn sale khi nhập giá sale.");
      return;
    }

    const hasSalePrice =
      !courseInfo.isFree &&
      salePrice > 0 &&
      salePrice < originalPrice &&
      Boolean(courseInfo.discountEndDate);

    try {
      setIsSavingCourse(true);

      const payload = {
        title: courseInfo.title.trim(),
        slug: courseInfo.slug || `course-${courseId}`,
        description: courseInfo.description,
        price: originalPrice,
        level: courseInfo.level,
        status: nextStatus || courseInfo.status,
        avgRating: 0,
        totalStudents: 0,
        publishDate: null,
        fileUploadId: pendingThumbnailUploadId,
        categoryId: Number(courseInfo.categoryId),
      };

      await courseApi.updateCourse(courseId, payload);

      if (hasSalePrice) {
        const discountEndDate = toIsoDateTime(courseInfo.discountEndDate);
        if (!discountEndDate) {
          throw new Error("Ngày kết thúc sale không hợp lệ.");
        }

        await courseApi.updateCourseDiscount(courseId, {
          salePrice,
          discountEndDate,
          campaignName: courseInfo.campaignName?.trim() || `SALE-${courseId}`,
        });
      }

      setCourseInfo((prev) => ({ ...prev, status: payload.status }));
      setPendingThumbnailUploadId(null);
      alert("Đã lưu thông tin khóa học.");
    } catch (saveError) {
      console.error(
        "Failed to save course:",
        saveError?.response?.data || saveError,
      );
      alert(saveError?.response?.data?.message || "Lưu khóa học thất bại");
    } finally {
      setIsSavingCourse(false);
    }
  };

  const handleThumbnailFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh hợp lệ.");
      event.target.value = "";
      return;
    }

    try {
      setIsUploadingThumbnail(true);

      const response = await fileUploadApi.uploadFiles({
        files: [file],
        fileType: "IMAGE",
        folderName: "btm-learning/course-thumbnails",
      });

      const uploadedFile = response?.data?.result?.[0];
      if (!uploadedFile?.id || !uploadedFile?.filePath) {
        throw new Error("Upload thumbnail failed");
      }

      setPendingThumbnailUploadId(uploadedFile.id);
      setCourseInfo((prev) => ({
        ...prev,
        thumbnailUrl: uploadedFile.filePath,
      }));
    } catch (uploadError) {
      console.error(
        "Thumbnail upload failed:",
        uploadError?.response?.data || uploadError,
      );
      alert(
        uploadError?.response?.data?.message || "Upload thumbnail thất bại",
      );
    } finally {
      setIsUploadingThumbnail(false);
      event.target.value = "";
    }
  };

  const handleAddChapter = async () => {
    try {
      const payload = {
        courseId,
        title: `Chương ${chapters.length + 1}`,
        orderIndex: chapters.length,
      };

      await sectionApi.createSection(payload);
      await loadData();
    } catch (createError) {
      console.error(
        "Create section failed:",
        createError?.response?.data || createError,
      );
      alert(createError?.response?.data?.message || "Tạo chương thất bại");
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa chương này? Tất cả bài học trong chương cũng sẽ bị xóa.",
    );
    if (!confirmed) return;

    try {
      await sectionApi.deleteSection(chapterId);
      await loadData();
    } catch (deleteError) {
      console.error(
        "Delete section failed:",
        deleteError?.response?.data || deleteError,
      );
      alert(deleteError?.response?.data?.message || "Xóa chương thất bại");
    }
  };

  const handleSaveChapter = async (chapterId) => {
    const chapter = chapters.find((item) => item.id === chapterId);
    if (!chapter) return;

    try {
      await sectionApi.updateSection(chapterId, {
        courseId,
        title: chapter.title,
        orderIndex: chapter.orderIndex,
      });
      await loadData();
      alert("Đã lưu chương thành công.");
    } catch (saveError) {
      console.error(
        "Update section failed:",
        saveError?.response?.data || saveError,
      );
      alert(saveError?.response?.data?.message || "Lưu chương thất bại");
    }
  };

  const toggleChapter = (chapterId) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isExpanded: !chapter.isExpanded }
          : chapter,
      ),
    );
  };

  const updateChapterTitle = (chapterId, nextTitle) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, title: nextTitle } : chapter,
      ),
    );
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // ---- Lesson operations ----
  const handleCreateLesson = async (sectionId) => {
    const title = (newLessonInputs[sectionId] || "").trim();
    if (!title) {
      showToast("Vui lòng nhập tên bài học.", "error");
      return;
    }

    try {
      setCreatingLessonForSection(sectionId);
      const chapter = chapters.find((c) => c.id === sectionId);
      const lessonCount = chapter?.lessons?.length || 0;
      const lessonType = newLessonTypes[sectionId] || "VIDEO";

      await lessonApi.createLesson({
        title,
        orderIndex: lessonCount,
        lessonType,
        durationSeconds: 0,
        isPreview: false,
        sectionId,
        courseId,
        fileUploadId: null,
        quizId: null,
      });

      setNewLessonInputs((prev) => ({ ...prev, [sectionId]: "" }));
      showToast(`Đã thêm bài học "${title}" (${lessonType})`);
      await loadData();
    } catch (createError) {
      console.error("Create lesson failed:", createError?.response?.data || createError);
      showToast(createError?.response?.data?.message || "Tạo bài học thất bại.", "error");
    } finally {
      setCreatingLessonForSection(null);
    }
  };

  const handleUpdateLessonTitle = async (lessonId) => {
    if (!editingLessonTitle.trim()) {
      setEditingLessonId(null);
      return;
    }
    try {
      await lessonApi.updateLesson(lessonId, { title: editingLessonTitle.trim() });
      setEditingLessonId(null);
      showToast("Đã cập nhật tên bài học");
      await loadData();
    } catch (err) {
      console.error("Update lesson title failed:", err);
      showToast("Cập nhật thất bại", "error");
    }
  };

  const handleChangeLessonType = async (lessonId, newType) => {
    try {
      await lessonApi.updateLesson(lessonId, { lessonType: newType });
      showToast(`Đã đổi loại bài học sang ${LESSON_TYPE_CONFIG[newType]?.label || newType}`);
      await loadData();
    } catch (err) {
      console.error("Change lesson type failed:", err);
      showToast("Đổi loại bài học thất bại", "error");
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa bài học này?");
    if (!confirmed) return;

    try {
      await lessonApi.deleteLesson(lessonId);
      showToast("Đã xóa bài học");
      await loadData();
    } catch (deleteError) {
      console.error("Delete lesson failed:", deleteError?.response?.data || deleteError);
      showToast(deleteError?.response?.data?.message || "Xóa bài học thất bại.", "error");
    }
  };

  const navigateToAssignContent = (lessonId, sectionId, currentType) => {
    navigate(
      `${basePath}/lessons?courseId=${courseId}&sectionId=${sectionId}&lessonId=${lessonId}&type=${currentType || "VIDEO"}`,
    );
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-600">
          Đang tải dữ liệu khóa học...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "error" ? "bg-red-500 text-white" : "bg-emerald-500 text-white"}`}>
          {toast.msg}
        </div>
      )}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            <span>Quản lý đào tạo</span>
            <span>/</span>
            <span>Khóa học</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              Chỉnh sửa khóa học
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            {courseInfo.title || "Khóa học chưa có tên"}
          </h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(`${basePath}/courses`)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Quay lại
          </button>
          <button
            onClick={() => handleSaveCourse("DRAFT")}
            disabled={isSavingCourse}
            className="px-4 py-2 bg-white border border-[#1a2b4c] text-[#1a2b4c] rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-70"
          >
            Lưu nháp
          </button>
          <button
            onClick={() => handleSaveCourse("PENDING")}
            disabled={isSavingCourse}
            className="px-5 py-2 bg-[#1a2b4c] text-white rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm disabled:opacity-70"
          >
            {isSavingCourse ? "Đang lưu..." : "Gửi duyệt"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 flex gap-8 items-start">
        <div className="flex-[6] space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              1. Thông tin chung
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tên khóa học <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                  value={courseInfo.title}
                  onChange={(event) =>
                    setCourseInfo((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm"
                    value={courseInfo.categoryId}
                    onChange={(event) =>
                      setCourseInfo((prev) => ({
                        ...prev,
                        categoryId: event.target.value,
                      }))
                    }
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Trình độ
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm"
                    value={courseInfo.level}
                    onChange={(event) =>
                      setCourseInfo((prev) => ({
                        ...prev,
                        level: event.target.value,
                      }))
                    }
                  >
                    {LEVEL_OPTIONS.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none text-sm text-gray-800"
                  value={courseInfo.description}
                  onChange={(event) =>
                    setCourseInfo((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="w-1/3">
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm"
                  value={courseInfo.status}
                  onChange={(event) =>
                    setCourseInfo((prev) => ({
                      ...prev,
                      status: event.target.value,
                    }))
                  }
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                2. Giá bán
              </h2>

              <label className="flex items-center gap-3 cursor-pointer mb-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={courseInfo.isFree}
                    onChange={(event) =>
                      setCourseInfo((prev) => ({
                        ...prev,
                        isFree: event.target.checked,
                        originalPrice: event.target.checked
                          ? ""
                          : prev.originalPrice,
                        salePrice: event.target.checked ? "" : prev.salePrice,
                        discountEndDate: event.target.checked
                          ? ""
                          : prev.discountEndDate,
                        campaignName: event.target.checked
                          ? ""
                          : prev.campaignName,
                      }))
                    }
                  />
                  <div
                    className={`block w-10 h-6 rounded-full transition-colors ${
                      courseInfo.isFree ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                      courseInfo.isFree ? "transform translate-x-4" : ""
                    }`}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  Khóa học miễn phí
                </span>
              </label>

              {!courseInfo.isFree && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Giá gốc (VNĐ)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                        value={courseInfo.originalPrice}
                        onChange={(event) =>
                          setCourseInfo((prev) => ({
                            ...prev,
                            originalPrice: event.target.value,
                          }))
                        }
                      />
                      <span className="absolute right-4 top-2.5 text-gray-400 font-medium">
                        đ
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Giá sale (tùy chọn)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                        value={courseInfo.salePrice}
                        onChange={(event) =>
                          setCourseInfo((prev) => ({
                            ...prev,
                            salePrice: event.target.value,
                          }))
                        }
                        placeholder="Để trống nếu không sale"
                      />
                      <span className="absolute right-4 top-2.5 text-gray-400 font-medium">
                        đ
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Giá sale phải nhỏ hơn giá gốc và cần có thời hạn sale.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Tên chiến dịch sale (tùy chọn)
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                      value={courseInfo.campaignName}
                      onChange={(event) =>
                        setCourseInfo((prev) => ({
                          ...prev,
                          campaignName: event.target.value,
                        }))
                      }
                      placeholder="VD: Summer Sale"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Hạn sale
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                      value={courseInfo.discountEndDate}
                      onChange={(event) =>
                        setCourseInfo((prev) => ({
                          ...prev,
                          discountEndDate: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                3. Ảnh đại diện
              </h2>

              <div className="mb-3 flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100">
                  {isUploadingThumbnail
                    ? "Đang upload..."
                    : "Chọn ảnh thumbnail"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={isUploadingThumbnail}
                    onChange={handleThumbnailFileChange}
                  />
                </label>
                {pendingThumbnailUploadId && (
                  <span className="text-xs font-medium text-emerald-600">
                    Thumbnail mới sẽ được lưu khi bấm "Lưu nháp" hoặc "Gửi
                    duyệt".
                  </span>
                )}
              </div>

              {courseInfo.thumbnailUrl ? (
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={resolveMediaUrl(courseInfo.thumbnailUrl)}
                    alt="course-thumbnail"
                    className="w-full h-44 object-cover"
                  />
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-6 text-center text-sm text-gray-500">
                  Chưa có ảnh đại diện. Vui lòng upload qua màn hình quản lý
                  media nếu cần.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-[4] space-y-4 sticky top-24">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Chương trình học
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tạo chương → Thêm bài học → Gán nội dung
                </p>
              </div>
              <button
                onClick={handleAddChapter}
                className="text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>+</span> Thêm chương
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {sortedChapters.length === 0 ? (
                <div className="text-sm text-gray-500 text-center py-8">
                  Chưa có chương nào.
                </div>
              ) : (
                sortedChapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shadow-sm"
                  >
                    {/* Chapter header */}
                    <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between group">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          className="font-bold text-gray-800 bg-transparent outline-none flex-1 border-b border-transparent focus:border-blue-400 text-sm py-1"
                          value={chapter.title}
                          onChange={(event) =>
                            updateChapterTitle(chapter.id, event.target.value)
                          }
                        />
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-400 mr-1">
                          {chapter.lessons.length} bài
                        </span>
                        <button
                          onClick={() => toggleChapter(chapter.id)}
                          className="p-1 hover:bg-gray-100 rounded text-gray-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 transform transition-transform ${chapter.isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Chapter body */}
                    {chapter.isExpanded && (
                      <div className="p-3 space-y-3">
                        {/* Lesson list */}
                        <div className="space-y-2">
                          {chapter.lessons.length === 0 ? (
                            <p className="text-xs text-center text-gray-400 py-2">
                              Chưa có bài học trong chương.
                            </p>
                          ) : (
                            chapter.lessons.map((lesson, lessonIndex) => {
                              const typeConfig =
                                LESSON_TYPE_CONFIG[lesson.lessonType] ||
                                LESSON_TYPE_CONFIG.VIDEO;
                              const hasContent =
                                lesson.videoUrl ||
                                lesson.documentUrl ||
                                (lesson.quizzes && lesson.quizzes.length > 0);
                              const isEditing = editingLessonId === lesson.id;

                              return (
                                <div
                                  key={lesson.id || `${chapter.id}-${lessonIndex}`}
                                  className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-sm group/lesson hover:border-blue-200 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5">
                                    {/* Order number */}
                                    <span className="text-[10px] font-bold text-gray-300 w-4 text-center shrink-0">
                                      {lessonIndex + 1}
                                    </span>

                                    {/* Type icon */}
                                    <div
                                      className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-bold ${typeConfig.color}`}
                                    >
                                      {typeConfig.icon}
                                    </div>

                                    {/* Lesson info */}
                                    <div className="flex-1 min-w-0">
                                      {isEditing ? (
                                        <input
                                          type="text"
                                          value={editingLessonTitle}
                                          onChange={(e) => setEditingLessonTitle(e.target.value)}
                                          onBlur={() => handleUpdateLessonTitle(lesson.id)}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") handleUpdateLessonTitle(lesson.id);
                                            if (e.key === "Escape") setEditingLessonId(null);
                                          }}
                                          autoFocus
                                          className="text-sm font-medium text-gray-700 w-full bg-blue-50 border border-blue-300 rounded px-2 py-0.5 outline-none"
                                        />
                                      ) : (
                                        <p
                                          className="text-sm font-medium text-gray-700 truncate cursor-pointer hover:text-blue-600"
                                          onDoubleClick={() => {
                                            setEditingLessonId(lesson.id);
                                            setEditingLessonTitle(lesson.title);
                                          }}
                                          title="Double-click để sửa tên"
                                        >
                                          {lesson.title}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-2 mt-0.5">
                                        {/* Type selector */}
                                        <select
                                          value={lesson.lessonType}
                                          onChange={(e) => handleChangeLessonType(lesson.id, e.target.value)}
                                          className="text-[10px] font-semibold text-gray-500 uppercase bg-transparent border-0 outline-none cursor-pointer p-0 pr-3"
                                          title="Đổi loại bài học"
                                        >
                                          {Object.entries(LESSON_TYPE_CONFIG).map(([key, cfg]) => (
                                            <option key={key} value={key}>{cfg.label}</option>
                                          ))}
                                        </select>
                                        {hasContent ? (
                                          <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Đã gán nội dung
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-semibold text-amber-500">
                                            Chưa gán nội dung
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover/lesson:opacity-100 transition-opacity shrink-0">
                                      <button
                                        onClick={() => {
                                          setEditingLessonId(lesson.id);
                                          setEditingLessonTitle(lesson.title);
                                        }}
                                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                                        title="Sửa tên"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={() => navigateToAssignContent(lesson.id, chapter.id, lesson.lessonType)}
                                        className="px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        title="Gán nội dung"
                                      >
                                        Gán nội dung ▸
                                      </button>
                                      <button
                                        onClick={() => handleDeleteLesson(lesson.id)}
                                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                        title="Xóa bài học"
                                      >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Add lesson button - navigates to lesson creation page */}
                        <button
                          onClick={() => navigate(`${basePath}/lessons?courseId=${courseId}&sectionId=${chapter.id}`)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs font-bold text-gray-500 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/50 transition-all"
                        >
                          <span className="text-base">+</span> Thêm bài học
                        </button>

                        {/* Chapter actions */}
                        <div className="flex justify-end items-center gap-2 pt-3 mt-1 border-t border-gray-200">
                          <button
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            Xóa chương
                          </button>
                          <button
                            onClick={() => handleSaveChapter(chapter.id)}
                            className="px-4 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold rounded transition-colors"
                          >
                            Lưu chương này
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
