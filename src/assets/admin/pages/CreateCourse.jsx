import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import categoryApi from "../../../api/categoryApi";
import courseApi from "../../../api/courseApi";
import fileUploadApi from "../../../api/fileUploadApi";
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
  const [pendingThumbnailUploadId, setPendingThumbnailUploadId] = useState(null);

  const [categories, setCategories] = useState([]);
  const [chapters, setChapters] = useState([]);

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

      const [courseResponse, categoryResponse, sectionResponse] = await Promise.all([
        courseApi.getCourseById(courseId),
        categoryApi.getCategories(),
        sectionApi.getSectionsByCourse(courseId),
      ]);

      const course = courseResponse?.data?.result;
      const fetchedCategories = categoryResponse?.data?.result || [];
      const fetchedSections = sectionResponse?.data?.result || [];
      const originalPrice = Number(course?.originalPrice ?? course?.price ?? 0);
      const currentPrice = Number(course?.price ?? 0);
      const hasSalePrice = currentPrice > 0 && originalPrice > 0 && currentPrice < originalPrice;

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
          lessons: section.lessons || [],
        }))
      );
    } catch (loadError) {
      console.error("Failed to load course editor data:", loadError?.response?.data || loadError);
      setError(loadError?.response?.data?.message || "Không thể tải dữ liệu khóa học.");
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
    return [...chapters].sort((left, right) => left.orderIndex - right.orderIndex);
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

    const originalPrice = courseInfo.isFree ? 0 : Number(courseInfo.originalPrice || 0);
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

    if (!courseInfo.isFree && hasInputSalePrice && !courseInfo.discountEndDate) {
      alert("Vui lòng chọn hạn sale khi nhập giá sale.");
      return;
    }

    const hasSalePrice =
      !courseInfo.isFree
      && salePrice > 0
      && salePrice < originalPrice
      && Boolean(courseInfo.discountEndDate);

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
      console.error("Failed to save course:", saveError?.response?.data || saveError);
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
      console.error("Thumbnail upload failed:", uploadError?.response?.data || uploadError);
      alert(uploadError?.response?.data?.message || "Upload thumbnail thất bại");
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
      console.error("Create section failed:", createError?.response?.data || createError);
      alert(createError?.response?.data?.message || "Tạo chương thất bại");
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    const confirmed = window.confirm("Bạn có chắc muốn xóa chương này?");
    if (!confirmed) return;

    try {
      await sectionApi.deleteSection(chapterId);
      await loadData();
    } catch (deleteError) {
      console.error("Delete section failed:", deleteError?.response?.data || deleteError);
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
      console.error("Update section failed:", saveError?.response?.data || saveError);
      alert(saveError?.response?.data?.message || "Lưu chương thất bại");
    }
  };

  const toggleChapter = (chapterId) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isExpanded: !chapter.isExpanded }
          : chapter
      )
    );
  };

  const updateChapterTitle = (chapterId, nextTitle) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId ? { ...chapter, title: nextTitle } : chapter
      )
    );
  };

  const navigateToLessonBuilder = (chapterId, type) => {
    navigate(`${basePath}/lessons?courseId=${courseId}&sectionId=${chapterId}&type=${type}`);
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
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <div className="text-sm text-gray-500 mb-1 flex items-center gap-2">
            <span>Quản lý đào tạo</span>
            <span>/</span>
            <span>Khóa học</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">Chỉnh sửa khóa học</span>
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
                    setCourseInfo((prev) => ({ ...prev, title: event.target.value }))
                  }
                />
              </div>

              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Danh mục</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm"
                    value={courseInfo.categoryId}
                    onChange={(event) =>
                      setCourseInfo((prev) => ({ ...prev, categoryId: event.target.value }))
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
                  <label className="block text-sm font-bold text-gray-700 mb-1">Trình độ</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm"
                    value={courseInfo.level}
                    onChange={(event) =>
                      setCourseInfo((prev) => ({ ...prev, level: event.target.value }))
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
                <label className="block text-sm font-bold text-gray-700 mb-2">Mô tả chi tiết</label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 resize-none text-sm text-gray-800"
                  value={courseInfo.description}
                  onChange={(event) =>
                    setCourseInfo((prev) => ({ ...prev, description: event.target.value }))
                  }
                />
              </div>

              <div className="w-1/3">
                <label className="block text-sm font-bold text-gray-700 mb-1">Trạng thái</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm"
                  value={courseInfo.status}
                  onChange={(event) =>
                    setCourseInfo((prev) => ({ ...prev, status: event.target.value }))
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
                        originalPrice: event.target.checked ? "" : prev.originalPrice,
                        salePrice: event.target.checked ? "" : prev.salePrice,
                        discountEndDate: event.target.checked ? "" : prev.discountEndDate,
                        campaignName: event.target.checked ? "" : prev.campaignName,
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
                <span className="text-sm font-bold text-gray-700">Khóa học miễn phí</span>
              </label>

              {!courseInfo.isFree && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Giá gốc (VNĐ)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                        value={courseInfo.originalPrice}
                        onChange={(event) =>
                          setCourseInfo((prev) => ({ ...prev, originalPrice: event.target.value }))
                        }
                      />
                      <span className="absolute right-4 top-2.5 text-gray-400 font-medium">đ</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Giá sale (tùy chọn)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min={0}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                        value={courseInfo.salePrice}
                        onChange={(event) =>
                          setCourseInfo((prev) => ({ ...prev, salePrice: event.target.value }))
                        }
                        placeholder="Để trống nếu không sale"
                      />
                      <span className="absolute right-4 top-2.5 text-gray-400 font-medium">đ</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Giá sale phải nhỏ hơn giá gốc và cần có thời hạn sale.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Tên chiến dịch sale (tùy chọn)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                      value={courseInfo.campaignName}
                      onChange={(event) =>
                        setCourseInfo((prev) => ({ ...prev, campaignName: event.target.value }))
                      }
                      placeholder="VD: Summer Sale"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Hạn sale</label>
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-gray-800 font-medium"
                      value={courseInfo.discountEndDate}
                      onChange={(event) =>
                        setCourseInfo((prev) => ({ ...prev, discountEndDate: event.target.value }))
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
                  {isUploadingThumbnail ? "Đang upload..." : "Chọn ảnh thumbnail"}
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
                    Thumbnail mới sẽ được lưu khi bấm "Lưu nháp" hoặc "Gửi duyệt".
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
                  Chưa có ảnh đại diện. Vui lòng upload qua màn hình quản lý media nếu cần.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-[4] space-y-4 sticky top-24">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[calc(100vh-120px)]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Chương trình học</h2>
                <p className="text-xs text-gray-500 mt-0.5">CRUD section đã kết nối backend</p>
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
                <div className="text-sm text-gray-500 text-center py-8">Chưa có chương nào.</div>
              ) : (
                sortedChapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden shadow-sm"
                  >
                    <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between group">
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          className="font-bold text-gray-800 bg-transparent outline-none flex-1 border-b border-transparent focus:border-blue-400 text-sm py-1"
                          value={chapter.title}
                          onChange={(event) => updateChapterTitle(chapter.id, event.target.value)}
                        />
                      </div>

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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    {chapter.isExpanded && (
                      <div className="p-3 space-y-3">
                        <div className="space-y-2">
                          {chapter.lessons.length === 0 ? (
                            <p className="text-xs text-center text-gray-400 py-2">Chưa có bài học trong chương.</p>
                          ) : (
                            chapter.lessons.map((lesson) => (
                              <div
                                key={lesson.id || `${chapter.id}-${lesson.title}`}
                                className="flex items-center gap-3 bg-white p-2.5 rounded border border-gray-200 shadow-sm"
                              >
                                <div className="w-6 h-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-[10px] font-bold">
                                  {lesson.lessonType?.slice(0, 1) || "L"}
                                </div>

                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-700">{lesson.title}</p>
                                  <p className="text-xs text-gray-500">{lesson.lessonType || "LESSON"}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => navigateToLessonBuilder(chapter.id, "VIDEO")}
                            className="flex-1 py-1.5 border border-dashed border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-white hover:text-blue-600 transition-colors"
                          >
                            + Bài học
                          </button>
                          <button
                            onClick={() => navigateToLessonBuilder(chapter.id, "QUIZ")}
                            className="flex-1 py-1.5 border border-dashed border-gray-300 rounded text-xs font-medium text-gray-600 hover:bg-white hover:text-purple-600 transition-colors"
                          >
                            + Bài thi
                          </button>
                        </div>

                        <div className="flex justify-end items-center gap-2 pt-3 mt-3 border-t border-gray-200">
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
