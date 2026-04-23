import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import StarRating from "../components/StarRating";
import courseApi from "../../../api/courseApi";
import courseReviewApi from "../../../api/courseReviewApi";
import axiosClient from "../../../api/axiosClient";
import enrollmentApi from "../../../api/enrollmentApi";
import paymentApi from "../../../api/paymentApi";
import voucherApi from "../../../api/voucherApi";
import { getAccessToken } from "../../../utils/session";
import { getUserIdFromToken } from "../../../utils/jwt";
import { resolveMediaUrl } from "../../../utils/media";

const COURSE_COLOR_POOL = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-400 to-red-500",
  "from-indigo-500 to-violet-500",
  "from-sky-500 to-blue-600",
];

const FALLBACK_FEATURES = [
  "Video bài giảng chất lượng cao",
  "Bài tập thực hành theo từng chương",
  "Truy cập trên mọi thiết bị",
  "Chứng chỉ hoàn thành khóa học",
  "Hỗ trợ học tập từ nền tảng",
];

const FALLBACK_REQUIREMENTS = [
  "Máy tính có kết nối internet",
  "Sẵn sàng học và thực hành đều đặn",
];

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatDurationFromSeconds = (seconds) => {
  const safeSeconds = Math.max(0, toNumber(seconds));
  const totalMinutes = Math.round(safeSeconds / 60);

  if (totalMinutes < 60) {
    return `${totalMinutes} phút`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!minutes) {
    return `${hours} giờ`;
  }

  return `${hours} giờ ${minutes} phút`;
};

const formatLessonDuration = (seconds) => {
  const safeSeconds = Math.max(0, toNumber(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const restSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(restSeconds).padStart(2, "0")}`;
};

const formatDateVN = (value) => {
  if (!value) return "";

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return "";

  return parsedDate.toLocaleDateString("vi-VN", {
    month: "2-digit",
    year: "numeric",
  });
};

const pickColor = (courseId) => {
  const safeId = Number(courseId);
  if (!Number.isFinite(safeId)) {
    return COURSE_COLOR_POOL[0];
  }

  return COURSE_COLOR_POOL[safeId % COURSE_COLOR_POOL.length];
};

const toInitials = (text) => {
  if (!text) return "AI";

  return String(text)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "AI";
};

const toLessonType = (lessonType) => {
  if (!lessonType) return "video";

  const normalized = String(lessonType).toUpperCase();
  if (normalized === "VIDEO") return "video";
  if (normalized === "QUIZ") return "quiz";
  if (normalized === "DOCUMENT" || normalized === "TEXT") return "document";

  return "video";
};

const getFirstPlayableVideo = (sections) => {
  for (const section of sections) {
    for (const lesson of section.lessons || []) {
      if (lesson.videoUrl) {
        return lesson.videoUrl;
      }
    }
  }

  return "";
};

const getFirstPreviewableLesson = (sections) => {
  for (const section of sections) {
    for (const lesson of section.lessons || []) {
      if (lesson.free && (lesson.videoUrl || lesson.documentUrl)) {
        return {
          ...lesson,
          sectionTitle: section.title,
        };
      }
    }
  }

  return null;
};

const toCourseViewModel = (rawCourse, reviews) => {
  const sections = Array.isArray(rawCourse?.sections) ? rawCourse.sections : [];

  const totalDurationSeconds = sections.reduce(
    (courseSeconds, section) =>
      courseSeconds + (section.lessons || []).reduce(
        (sectionSeconds, lesson) => sectionSeconds + toNumber(lesson.durationSeconds),
        0,
      ),
    0,
  );

  const sectionItems = sections.map((section) => ({
    id: section.id,
    title: section.title,
    lessons: (section.lessons || []).map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      duration: formatLessonDuration(lesson.durationSeconds),
      durationSeconds: toNumber(lesson.durationSeconds),
      type: toLessonType(lesson.lessonType),
      videoUrl: lesson.videoUrl || "",
      documentUrl: lesson.documentUrl || "",
      quizId: lesson?.quizResponse?.id,
      free: !!(lesson.preview ?? lesson.isPreview),
    })),
  }));

  const normalizedReviews = reviews.map((review) => ({
    id: review.id || `${review.userId || "unknown"}-${review.createdAt || Date.now()}`,
    userId: toNumber(review.userId, 0),
    user: review.userFullName || `Học viên #${review.userId}`,
    avatar: toInitials(review.userFullName || `Học viên ${review.userId || ""}`),
    avatarUrl: review.userAvatarUrl || "",
    rating: toNumber(review.rating),
    date: new Date(review.createdAt).toLocaleDateString("vi-VN"),
    comment: review.comment,
    createdAt: review.createdAt,
  }));

  const instructor = rawCourse?.instructor || {};
  const instructorName = instructor?.fullName || "BTM Learning";
  const instructorBio = instructor?.bio || "Đội ngũ giảng viên nhiều kinh nghiệm, nội dung được cập nhật liên tục theo nhu cầu thực tế.";

  const reviewCount = normalizedReviews.length;

  // Compute totalLessons dynamically from sections (API field may be stale)
  const dynamicTotalLessons = sectionItems.reduce((sum, s) => sum + s.lessons.length, 0);

  return {
    id: rawCourse.id,
    title: rawCourse.title,
    description: rawCourse.description || "Khóa học đang được cập nhật mô tả chi tiết.",
    longDescription: rawCourse.description || "Khóa học đang được cập nhật mô tả chi tiết.",
    instructor: instructorName,
    instructorEmail: instructor?.email || "",
    instructorTitle: "Giảng viên",
    instructorAvatar: toInitials(instructorName),
    instructorAvatarUrl: instructor?.avatarUrl || "",
    instructorBio,
    category: rawCourse?.category?.name || "Khóa học",
    price: toNumber(rawCourse.price),
    originalPrice: toNumber(rawCourse.originalPrice || rawCourse.price),
    rating: toNumber(rawCourse.avgRating),
    reviewCount,
    students: toNumber(rawCourse.totalStudents),
    duration: formatDurationFromSeconds(totalDurationSeconds),
    durationSeconds: totalDurationSeconds,
    lessons: dynamicTotalLessons,
    level: rawCourse.level || "Tất cả trình độ",
    language: "Tiếng Việt",
    lastUpdated: formatDateVN(rawCourse.updateAt || rawCourse.createAt) || "gần đây",
    thumbnailUrl: rawCourse.thumbnailUrl || "",
    previewVideoUrl: getFirstPlayableVideo(sectionItems),
    color: pickColor(rawCourse.id),
    features: [
      `${dynamicTotalLessons} bài học`,
      `${toNumber(rawCourse.totalStudents).toLocaleString("vi-VN")} học viên đã tham gia`,
      ...FALLBACK_FEATURES,
    ],
    requirements: FALLBACK_REQUIREMENTS,
    sections: sectionItems,
    reviews: normalizedReviews,
  };
};

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState([0]);
  const [course, setCourse] = useState(null);
  const [previewLesson, setPreviewLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false);
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [courseProgressPercent, setCourseProgressPercent] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [reviewDraft, setReviewDraft] = useState({ rating: 5, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewsRefreshKey, setReviewsRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadCourse = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");
        setIsAlreadyEnrolled(false);

        const canCheckEnrollment = !!getAccessToken();

        const [courseResponse, reviewsResponse, progressResponse] = await Promise.all([
          courseApi.getCourseById(id),
          courseReviewApi.getReviewsByCourse(id).catch(() => null),
          canCheckEnrollment
            ? axiosClient.get(`/courses/progress/${id}`).catch(() => null)
            : Promise.resolve(null),
        ]);

        const rawCourse = courseResponse?.data?.result;

        if (!rawCourse) {
          throw new Error("Không tìm thấy khóa học.");
        }

        const reviewList = Array.isArray(reviewsResponse?.data?.result)
          ? reviewsResponse.data.result
          : [];

        if (!isMounted) return;

        const normalizedCourse = toCourseViewModel(rawCourse, reviewList);

        setCourse(normalizedCourse);
        setPreviewLesson(getFirstPreviewableLesson(normalizedCourse.sections));
        const progressResult = progressResponse?.data?.result;
        setIsAlreadyEnrolled(!!progressResult?.courseId);
        setCourseProgressPercent(toNumber(progressResult?.progressPercent));
        setPromoCode("");
        setAppliedVoucher(null);
        setExpandedSections([0]);
      } catch {
        if (!isMounted) return;
        setErrorMessage("Không tải được thông tin khóa học. Vui lòng thử lại sau.");
        setCourseProgressPercent(0);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (id) {
      loadCourse();
    }

    return () => {
      isMounted = false;
    };
  }, [id, reviewsRefreshKey]);

  const ratingPercentages = useMemo(() => {
    if (!course?.reviews?.length) {
      return [
        { star: 5, percent: 0 },
        { star: 4, percent: 0 },
        { star: 3, percent: 0 },
        { star: 2, percent: 0 },
        { star: 1, percent: 0 },
      ];
    }

    const reviewCount = course.reviews.length;

    return [5, 4, 3, 2, 1].map((star) => {
      const matched = course.reviews.filter(
        (review) => Math.round(toNumber(review.rating)) === star,
      ).length;

      return {
        star,
        percent: Math.round((matched / reviewCount) * 100),
      };
    });
  }, [course?.reviews]);

  const currentUserId = getUserIdFromToken(getAccessToken());

  const hasSubmittedReview = useMemo(() => {
    if (!currentUserId || !course?.reviews?.length) return false;

    return course.reviews.some((review) => toNumber(review.userId) === currentUserId);
  }, [course?.reviews, currentUserId]);

  const latestFiveStarReviews = useMemo(() => {
    if (!course?.reviews?.length) return [];

    return course.reviews
      .filter((review) => Math.round(toNumber(review.rating)) === 5 && String(review.comment || "").trim())
      .slice(0, 3);
  }, [course?.reviews]);

  const canSubmitReview =
    !!currentUserId
    && isAlreadyEnrolled
    && courseProgressPercent >= 100
    && !hasSubmittedReview;

  const handleSubmitReview = async () => {
    if (!course?.id) return;

    const normalizedRating = Math.max(1, Math.min(5, toNumber(reviewDraft.rating, 5)));
    const normalizedComment = String(reviewDraft.comment || "").trim();

    if (!normalizedComment) {
      toast.error("Vui lòng nhập nhận xét trước khi gửi đánh giá.");
      return;
    }

    try {
      setIsSubmittingReview(true);
      await courseReviewApi.createReview({
        courseId: course.id,
        rating: normalizedRating,
        comment: normalizedComment,
      });

      toast.success("Cảm ơn bạn đã gửi đánh giá khóa học.");
      setReviewDraft({ rating: 5, comment: "" });
      setReviewsRefreshKey((prev) => prev + 1);
    } catch (error) {
      const apiMessage = error?.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại.";
      toast.error(apiMessage);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const formatPrice = (price) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleApplyVoucher = async () => {
    if (isAlreadyEnrolled) {
      toast("Bạn đã đăng ký khóa học này.");
      return;
    }

    if (!course || course.price <= 0) {
      toast.error("Khóa học miễn phí không áp dụng mã khuyến mãi.");
      return;
    }

    const code = promoCode.trim();
    if (!code) {
      toast.error("Vui lòng nhập mã khuyến mãi.");
      return;
    }

    try {
      setIsApplyingVoucher(true);
      const response = await voucherApi.applyVoucher({ code, courseId: course.id });
      const voucherResult = response?.data?.result;

      if (!voucherResult) {
        throw new Error("Mã khuyến mãi không hợp lệ.");
      }

      setAppliedVoucher({
        code: voucherResult.code || code,
        discountPercent: toNumber(voucherResult.discountPercent),
        finalPrice: toNumber(voucherResult.finalPrice, course.price),
        message: voucherResult.message || "Áp mã khuyến mãi thành công.",
      });
      setPromoCode(voucherResult.code || code);
      toast.success(voucherResult.message || "Áp mã khuyến mãi thành công.");
    } catch (error) {
      const apiMessage = error?.response?.data?.message || error?.message || "Mã khuyến mãi không hợp lệ.";
      setAppliedVoucher(null);
      toast.error(apiMessage);
    } finally {
      setIsApplyingVoucher(false);
    }
  };

  const handleEnroll = async () => {
    if (!course) return;

    if (isAlreadyEnrolled) {
      navigate(`/learning/${course.id}`);
      return;
    }

    const isAuthenticated = !!getAccessToken();
    if (!isAuthenticated) {
      navigate("/auth/login");
      return;
    }

    try {
      setIsEnrolling(true);

      const voucherCode = appliedVoucher?.code || undefined;
      const hasPaidPrice = Math.max(toNumber(course.price), toNumber(course.originalPrice)) > 0;
      const shouldUsePaymentFlow = hasPaidPrice || !!voucherCode;

      if (shouldUsePaymentFlow) {
        const paymentResponse = await paymentApi.createPaymentUrl({
          courseId: course.id,
          code: voucherCode,
        });
        const paymentUrl = paymentResponse?.data?.url;

        if (!paymentUrl) {
          throw new Error("Không tạo được liên kết thanh toán.");
        }

        localStorage.setItem("btm_pending_payment_course_id", String(course.id));
        window.location.assign(paymentUrl);
        return;
      }

      await enrollmentApi.enroll({
        courseId: course.id,
        price: course.price,
      });

      toast.success("Đăng ký khóa học thành công.");
      setIsAlreadyEnrolled(true);
      localStorage.removeItem("btm_pending_payment_course_id");
      navigate(`/learning/${course.id}`);
    } catch (error) {
      const apiMessage = error?.response?.data?.message || error?.message || "";
      const normalizedMessage = String(apiMessage).toLowerCase();

      if (normalizedMessage.includes("already") || normalizedMessage.includes("you already own")) {
        toast.success("Bạn đã đăng ký khóa học trước đó.");
        setIsAlreadyEnrolled(true);
        localStorage.removeItem("btm_pending_payment_course_id");
        navigate(`/learning/${course.id}`);
        return;
      }

      if (error?.response?.status === 401 || error?.response?.status === 403) {
        toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        navigate("/auth/login");
        return;
      }

      if (normalizedMessage.includes("not published")) {
        toast.error("Khóa học chưa mở đăng ký ở thời điểm hiện tại.");
        return;
      }

      toast.error(apiMessage || "Đăng ký khóa học thất bại. Vui lòng thử lại.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6 animate-pulse">
          <div className="h-10 w-2/3 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-1/2 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-80 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  if (!course || errorMessage) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <p className="text-sm font-medium">{errorMessage || "Không tìm thấy khóa học."}</p>
          <button
            onClick={() => navigate("/courses")}
            className="mt-4 inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Quay lại danh sách khóa học
          </button>
        </div>
      </div>
    );
  }

  const effectivePrice = appliedVoucher
    ? toNumber(appliedVoucher.finalPrice, course.price)
    : course.price;
  const discount = course.originalPrice > effectivePrice
    ? Math.round((1 - effectivePrice / course.originalPrice) * 100)
    : 0;
  const thumbnailUrl = resolveMediaUrl(course.thumbnailUrl);
  const previewVideoUrl = resolveMediaUrl(course.previewVideoUrl);
  const instructorAvatarUrl = resolveMediaUrl(course.instructorAvatarUrl);
  const isAuthenticated = !!getAccessToken();
  const canViewDurationDetails = isAlreadyEnrolled;
  const showPricing = !isAlreadyEnrolled;
  const showVoucherInput = showPricing && course.price > 0;
  const displayedCourseDuration = course.durationSeconds > 0 ? course.duration : `${course.lessons} bài học`;
  const progressHint = isAlreadyEnrolled
    ? `${courseProgressPercent}% hoàn thành`
    : "Bạn cần đăng ký và hoàn thành 100% khóa học để đánh giá.";
  const enrollButtonLabel = isEnrolling
    ? "Đang xử lý..."
    : isAlreadyEnrolled
      ? "Vào học ngay"
    : !isAuthenticated
      ? "Đăng nhập để đăng ký"
    : effectivePrice > 0
      ? "Thanh toán và đăng ký"
      : "Nhận khóa học ngay";

  const toggleSection = (index) => {
    setExpandedSections((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0);
  const tabs = [
    { id: "overview", label: "Tổng quan" },
    { id: "curriculum", label: "Nội dung" },
    { id: "reviews", label: `Đánh giá (${course.reviewCount})` },
    { id: "instructor", label: "Giảng viên" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Hero Banner */}
      <div className={`bg-gradient-to-r ${course.color} dark:from-slate-900 dark:to-slate-800`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold">
                  {course.level}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-white/80 text-lg mb-6 max-w-2xl">
                {course.description}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-amber-300">{course.rating}</span>
                  <StarRating rating={course.rating} size="sm" />
                  <span className="text-white/60">({course.reviewCount} đánh giá)</span>
                </div>
                <span className="text-white/40">•</span>
                <span className="text-white/80">{course.students.toLocaleString()} học viên</span>
                <span className="text-white/40">•</span>
                <span className="text-white/80">Cập nhật {course.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-3 mt-4">
                {instructorAvatarUrl ? (
                  <img
                    src={instructorAvatarUrl}
                    alt={course.instructor}
                    className="w-8 h-8 rounded-full object-cover border border-white/25"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {course.instructorAvatar}
                  </div>
                )}
                <span className="text-white/90 font-medium">{course.instructor}</span>
              </div>
            </div>

            {/* Right - Purchase Card (Desktop) */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className={`h-44 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
                  {previewVideoUrl ? (
                    <video
                      className="h-full w-full object-cover"
                      controls
                      preload="metadata"
                      poster={thumbnailUrl || undefined}
                      src={previewVideoUrl}
                    />
                  ) : thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center">
                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {showPricing ? (
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                        {formatPrice(effectivePrice)}
                      </span>
                      {discount > 0 && (
                        <>
                          <span className="text-lg text-slate-400 line-through">
                            {formatPrice(course.originalPrice)}
                          </span>
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-md text-xs font-bold">
                            -{discount}%
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                      Bạn đã đăng ký khóa học này.
                    </div>
                  )}

                  {showVoucherInput && (
                    <div className="mb-4 rounded-xl border border-slate-200 dark:border-white/10 p-3">
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">Mã khuyến mãi</p>
                      <div className="flex gap-2">
                        <input
                          value={promoCode}
                          onChange={(event) => {
                            setPromoCode(event.target.value.toUpperCase());
                            setAppliedVoucher(null);
                          }}
                          placeholder="Nhập mã"
                          className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
                        />
                        <button
                          type="button"
                          onClick={handleApplyVoucher}
                          disabled={isApplyingVoucher}
                          className="rounded-lg border border-indigo-200 dark:border-indigo-500/30 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300 disabled:opacity-60"
                        >
                          {isApplyingVoucher ? "Đang áp..." : "Áp dụng"}
                        </button>
                      </div>
                      {appliedVoucher && (
                        <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
                          Đã áp mã {appliedVoucher.code} - giảm {appliedVoucher.discountPercent}%
                        </p>
                      )}
                    </div>
                  )}
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all mb-3 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {enrollButtonLabel}
                  </button>

                  <div className="mt-5 space-y-3 text-sm">
                    {[
                      course.durationSeconds > 0 ? { icon: "⏱️", text: course.duration } : null,
                      { icon: "📚", text: `${course.lessons} bài học` },
                      { icon: "📱", text: "Truy cập mọi thiết bị" },
                      { icon: "🏆", text: "Chứng chỉ hoàn thành" },
                      { icon: "♾️", text: "Truy cập trọn đời" },
                    ].filter(Boolean).map((item) => (
                      <div key={item.text} className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                        <span>{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Purchase Bar */}
      <div className="lg:hidden sticky top-16 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/[0.06] px-4 py-3 flex items-center justify-between shadow-sm">
        <div>
          {showPricing ? (
            <>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                {formatPrice(effectivePrice)}
              </span>
              {discount > 0 && (
                <span className="text-sm text-slate-400 line-through ml-2">
                  {formatPrice(course.originalPrice)}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
              Đã đăng ký khóa học
            </span>
          )}
        </div>
        <button
          onClick={handleEnroll}
          disabled={isEnrolling}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {enrollButtonLabel}
        </button>
      </div>

      {showVoucherInput && (
        <div className="lg:hidden border-b border-slate-200 dark:border-white/[0.06] bg-white dark:bg-slate-900 px-4 py-3">
          <div className="flex gap-2">
            <input
              value={promoCode}
              onChange={(event) => {
                setPromoCode(event.target.value.toUpperCase());
                setAppliedVoucher(null);
              }}
              placeholder="Nhập mã khuyến mãi"
              className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 px-3 py-2 text-sm bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleApplyVoucher}
              disabled={isApplyingVoucher}
              className="rounded-lg border border-indigo-200 dark:border-indigo-500/30 px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-300 disabled:opacity-60"
            >
              {isApplyingVoucher ? "Đang áp..." : "Áp dụng"}
            </button>
          </div>
          {appliedVoucher && (
            <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">
              Đã áp mã {appliedVoucher.code} - giảm {appliedVoucher.discountPercent}%
            </p>
          )}
        </div>
      )}

      {/* Tabs + Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 min-w-0">
            {/* Tab Navigation */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl p-1 mb-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Giới thiệu khóa học
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {course.longDescription}
                  </p>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Bạn sẽ nhận được
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.features.map((f) => (
                      <div key={f} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                    Yêu cầu
                  </h2>
                  <ul className="space-y-2">
                    {course.requirements.map((r) => (
                      <li key={r} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab Content: Curriculum */}
            {activeTab === "curriculum" && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {course.sections.length} chương • {totalLessons} bài học{course.durationSeconds > 0 ? ` • ${course.duration}` : ""}
                  </p>
                  <button
                    onClick={() =>
                      setExpandedSections(
                        expandedSections.length === course.sections.length
                          ? []
                          : course.sections.map((_, i) => i)
                      )
                    }
                    className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                  >
                    {expandedSections.length === course.sections.length
                      ? "Thu gọn tất cả"
                      : "Mở rộng tất cả"}
                  </button>
                </div>
                {previewLesson && (
                  <div className="mb-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/70 dark:bg-indigo-500/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-300 mb-1">
                      Bài học xem thử
                    </p>
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                      {previewLesson.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {previewLesson.sectionTitle} • {previewLesson.duration}
                    </p>

                    {previewLesson.videoUrl && (
                      <video
                        className="mt-3 w-full rounded-xl bg-black"
                        controls
                        preload="metadata"
                        src={resolveMediaUrl(previewLesson.videoUrl)}
                      />
                    )}

                    {!previewLesson.videoUrl && previewLesson.documentUrl && (
                      <div className="mt-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 p-3">
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                          Bài học này có tài liệu xem thử.
                        </p>
                        <a
                          href={resolveMediaUrl(previewLesson.documentUrl)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                        >
                          Mở tài liệu xem thử
                        </a>
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-3">
                  {course.sections.map((section, si) => (
                    <div
                      key={si}
                      className="border border-slate-200 dark:border-white/[0.06] rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleSection(si)}
                        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <svg
                            className={`w-4 h-4 text-slate-400 transition-transform ${expandedSections.includes(si) ? "rotate-90" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="font-semibold text-sm text-slate-900 dark:text-white">
                            {section.title}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {section.lessons.length} bài
                        </span>
                      </button>
                      {expandedSections.includes(si) && (
                        <div className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                          {section.lessons.map((lesson) => {
                            const isPreviewable = lesson.free && (lesson.videoUrl || lesson.documentUrl);
                            const isActivePreview = previewLesson?.id === lesson.id;

                            return (
                              <button
                                key={lesson.id}
                                type="button"
                                onClick={() => {
                                  if (!isPreviewable) return;

                                  setPreviewLesson({
                                    ...lesson,
                                    sectionTitle: section.title,
                                  });
                                }}
                                className={`w-full flex items-center justify-between px-4 py-3 pl-12 transition-colors text-left ${
                                  isActivePreview
                                    ? "bg-indigo-50 dark:bg-indigo-500/10"
                                    : "hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                                } ${isPreviewable ? "cursor-pointer" : "cursor-default"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm text-slate-700 dark:text-slate-300">
                                    {lesson.title}
                                  </span>
                                  {lesson.free && (
                                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded text-[10px] font-bold">
                                      Xem trước
                                    </span>
                                  )}
                                  {isPreviewable && (
                                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-300">
                                      Nhấn để xem
                                    </span>
                                  )}
                                </div>
                                {lesson.durationSeconds > 0 && (
                                  <span className="text-xs text-slate-400">{lesson.duration}</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab Content: Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-6 animate-fade-in">
                {canSubmitReview && (
                  <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                      Đánh giá khóa học của bạn
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewDraft((prev) => ({ ...prev, rating: star }))}
                          className={`text-2xl leading-none transition-colors ${
                            reviewDraft.rating >= star
                              ? "text-amber-500"
                              : "text-slate-300 dark:text-slate-600"
                          }`}
                          aria-label={`Chọn ${star} sao`}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={reviewDraft.comment}
                      onChange={(event) => setReviewDraft((prev) => ({ ...prev, comment: event.target.value }))}
                      placeholder="Chia sẻ cảm nhận của bạn về khóa học..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
                    />

                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Đánh giá của bạn giúp học viên khác chọn khóa học phù hợp hơn.
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmitReview}
                        disabled={isSubmittingReview}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
                      >
                        {isSubmittingReview ? "Đang gửi..." : "Gửi đánh giá"}
                      </button>
                    </div>
                  </div>
                )}

                {!canSubmitReview && (
                  <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 dark:border-white/[0.06] dark:bg-slate-800/40 dark:text-slate-300">
                    {hasSubmittedReview
                      ? "Bạn đã gửi đánh giá cho khóa học này. Cảm ơn bạn!"
                      : progressHint}
                  </div>
                )}

                {!!latestFiveStarReviews.length && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-5 dark:border-amber-500/20 dark:bg-amber-500/10">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                      Bình luận 5 sao mới nhất
                    </h3>
                    <div className="space-y-3">
                      {latestFiveStarReviews.map((review) => (
                        <div
                          key={`latest-five-star-${review.id}`}
                          className="rounded-xl border border-amber-100 bg-white px-4 py-3 dark:border-amber-500/20 dark:bg-slate-900"
                        >
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{review.user}</p>
                            <span className="text-xs font-bold text-amber-500">5 ★</span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-300">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating Summary */}
                <div className="flex items-center gap-8 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-slate-900 dark:text-white">
                      {course.rating}
                    </div>
                    <StarRating rating={course.rating} size="md" />
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {course.reviewCount} đánh giá
                    </p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingPercentages.map(({ star, percent }) => {
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm text-slate-600 dark:text-slate-400 w-3">{star}</span>
                          <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="text-xs text-slate-400 w-8">{percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review List */}
                {!course.reviews.length && (
                  <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-600 dark:border-white/[0.06] dark:bg-slate-800/40 dark:text-slate-300">
                    Chưa có đánh giá cho khóa học này.
                  </div>
                )}

                {course.reviews.map((review, index) => (
                  <div key={`${review.id}-${index}`} className="p-5 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {review.avatarUrl ? (
                          <img
                            src={resolveMediaUrl(review.avatarUrl)}
                            alt={review.user}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/10"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                            {review.avatar}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white">{review.user}</p>
                          <p className="text-xs text-slate-400">{review.date}</p>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content: Instructor */}
            {activeTab === "instructor" && (
              <div className="animate-fade-in">
                <div className="flex items-start gap-5 p-6 bg-slate-50 dark:bg-slate-800/40 rounded-2xl">
                  {instructorAvatarUrl ? (
                    <img
                      src={instructorAvatarUrl}
                      alt={course.instructor}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-white/10 flex-shrink-0"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                      {course.instructorAvatar}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                      {course.instructor}
                    </h3>
                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-3">
                      {course.instructorTitle}
                    </p>
                    <div className="flex items-center gap-6 mb-4 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {course.rating} đánh giá
                      </span>
                      <span>{course.students.toLocaleString("vi-VN")} học viên</span>
                      <span>{course.lessons} bài học</span>
                    </div>
                    {course.instructorEmail && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                        Liên hệ: {course.instructorEmail}
                      </p>
                    )}
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {course.instructorBio}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
