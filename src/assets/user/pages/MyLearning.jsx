import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";
import enrollmentApi from "../../../api/enrollmentApi";
import lessonApi from "../../../api/lessonApi";
import { resolveMediaUrl } from "../../../utils/media";
import { getAccessToken } from "../../../utils/session";
import { getUserIdFromToken } from "../../../utils/jwt";

const COURSE_COLOR_POOL = [
  "from-blue-500 to-cyan-400",
  "from-purple-500 to-pink-500",
  "from-emerald-500 to-teal-500",
  "from-orange-400 to-red-500",
  "from-gray-600 to-gray-800",
  "from-amber-400 to-orange-500",
  "from-sky-500 to-blue-600",
  "from-pink-400 to-rose-500",
  "from-yellow-400 to-amber-500",
  "from-cyan-500 to-blue-500",
];

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const ACTIVE_ENROLLMENT_STATUSES = new Set(["ACTIVE", "IN_PROGRESS", "COMPLETED"]);

const resolveEnrollmentStatus = (enrollment) => {
  const status = String(enrollment?.status || "").toUpperCase();
  const paymentStatus = String(enrollment?.paymentStatus || "").toUpperCase();

  if (status) return status;
  if (paymentStatus === "FAILED") return "CANCELLED";
  return "ACTIVE";
};

const getEnrollmentCourseId = (enrollment) =>
  toNumber(enrollment?.course?.id ?? enrollment?.courseId, 0);

const getEnrollmentUserId = (enrollment) =>
  toNumber(enrollment?.user?.id ?? enrollment?.userId, 0);

const isEnrollmentOwnedByUser = (enrollment, currentUserId) => {
  if (currentUserId <= 0) return false;
  return getEnrollmentUserId(enrollment) === currentUserId;
};

const getEnrollmentSortTime = (enrollment) => {
  const timestamp = enrollment?.updatedAt
    || enrollment?.completedAt
    || enrollment?.createdAt
    || enrollment?.createAt;

  if (!timestamp) return 0;

  const parsed = new Date(timestamp).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const getEnrollmentStatusScore = (status) => {
  if (status === "COMPLETED") return 3;
  if (status === "IN_PROGRESS") return 2;
  if (status === "ACTIVE") return 1;
  return 0;
};

const keepMoreRelevantEnrollment = (currentEnrollment, nextEnrollment) => {
  if (!currentEnrollment) return nextEnrollment;

  const currentTime = getEnrollmentSortTime(currentEnrollment);
  const nextTime = getEnrollmentSortTime(nextEnrollment);

  if (nextTime !== currentTime) {
    return nextTime > currentTime ? nextEnrollment : currentEnrollment;
  }

  const currentScore = getEnrollmentStatusScore(resolveEnrollmentStatus(currentEnrollment));
  const nextScore = getEnrollmentStatusScore(resolveEnrollmentStatus(nextEnrollment));

  return nextScore > currentScore ? nextEnrollment : currentEnrollment;
};

const dedupeEnrollmentsByCourse = (enrollments) => {
  const byCourse = new Map();

  enrollments.forEach((enrollment) => {
    const courseId = getEnrollmentCourseId(enrollment);
    if (!courseId) return;

    const previous = byCourse.get(courseId);
    byCourse.set(courseId, keepMoreRelevantEnrollment(previous, enrollment));
  });

  return Array.from(byCourse.values());
};

const MyLearning = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("learning");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [learningCourses, setLearningCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadMyLearning = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const token = getAccessToken();
        if (!token) {
          setLearningCourses([]);
          setCompletedCourses([]);
          return;
        }

        const currentUserId = toNumber(getUserIdFromToken(token), 0);
        if (currentUserId <= 0) {
          setLearningCourses([]);
          setCompletedCourses([]);
          return;
        }

        // Fetch all enrollments for current user
        const enrollmentResponse = await enrollmentApi.searchEnrollments({
          pageNo: 0,
          pageSize: 100,
          userId: currentUserId,
        });

        const enrollmentPage = enrollmentResponse?.data?.result;
        const rawEnrollments = Array.isArray(enrollmentPage?.content)
          ? enrollmentPage.content
          : Array.isArray(enrollmentPage)
            ? enrollmentPage
            : [];

        const enrollments = dedupeEnrollmentsByCourse(
          rawEnrollments.filter((enrollment) =>
            ACTIVE_ENROLLMENT_STATUSES.has(resolveEnrollmentStatus(enrollment))
            && isEnrollmentOwnedByUser(enrollment, currentUserId)
            && getEnrollmentCourseId(enrollment) > 0,
          ),
        );

        if (!isMounted) return;

        // Fetch progress for each enrolled course
        const coursesWithProgress = await Promise.all(
          enrollments.map(async (enrollment, index) => {
            const course = enrollment.course || {};
            const courseId = course.id || enrollment.courseId;
            const enrollmentStatus = resolveEnrollmentStatus(enrollment);

            let progressPercent = 0;
            let completedLessons = 0;
            let totalLessons = toNumber(course.totalLessons);

            try {
              const progressResponse = await lessonApi.getCourseProgress(courseId);
              const progressData = progressResponse?.data?.result;

              if (progressData) {
                progressPercent = toNumber(progressData.progressPercent);

                // Count completed lessons from sections
                const sections = progressData.sections || [];
                sections.forEach((section) => {
                  (section.lessons || []).forEach((lesson) => {
                    if (
                      String(lesson.status || "").toUpperCase() === "COMPLETED"
                    ) {
                      completedLessons++;
                    }
                  });
                });

                if (totalLessons === 0) {
                  totalLessons = sections.reduce(
                    (sum, s) => sum + (s.lessons || []).length,
                    0
                  );
                }
              }
            } catch {
              // Progress fetch failed, use defaults
            }

            const thumbnailUrl = resolveMediaUrl(course.thumbnailUrl);

            return {
              id: courseId,
              title: course.title || enrollment.courseTitle || "Khóa học",
              enrollmentStatus,
              instructor:
                course.instructor?.fullName ||
                enrollment.instructorName ||
                "BTM Learning",
              progress: progressPercent,
              lastAccess: enrollment.updatedAt
                ? formatTimeAgo(enrollment.updatedAt)
                : "",
              completedDate: enrollment.completedAt
                ? new Date(enrollment.completedAt).toLocaleDateString("vi-VN")
                : progressPercent >= 100
                  ? "Đã hoàn thành"
                  : "",
              color: COURSE_COLOR_POOL[index % COURSE_COLOR_POOL.length],
              lessons: totalLessons,
              completedLessons,
              rating: toNumber(course.avgRating),
              thumbnailUrl,
              hasCertificate: progressPercent >= 100,
            };
          })
        );

        if (!isMounted) return;

        const completed = coursesWithProgress.filter(
          (c) => c.enrollmentStatus === "COMPLETED" || c.progress >= 100,
        );
        const learning = coursesWithProgress.filter(
          (c) => c.enrollmentStatus !== "COMPLETED" && c.progress < 100,
        );

        setLearningCourses(learning);
        setCompletedCourses(completed);
      } catch {
        if (!isMounted) return;
        setErrorMessage("Không tải được danh sách khóa học. Vui lòng thử lại sau.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMyLearning();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  const courses = {
    learning: learningCourses,
    completed: completedCourses,
    wishlist: [],
  };

  const tabs = [
    { id: "learning", label: "Đang học", count: courses.learning.length },
    { id: "completed", label: "Hoàn thành", count: courses.completed.length },
    { id: "wishlist", label: "Yêu thích", count: courses.wishlist.length },
  ];

  const currentCourses = courses[activeTab] || [];
  const filteredCourses = currentCourses.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            Khóa học của tôi
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Quản lý và theo dõi tiến độ học tập của bạn
          </p>
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-1 bg-white dark:bg-slate-800/60 rounded-xl p-1 border border-slate-200 dark:border-white/[0.06]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  activeTab === tab.id
                    ? "bg-white/20"
                    : "bg-slate-100 dark:bg-white/10 text-slate-400"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm khóa học..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:border-indigo-500 text-sm text-slate-900 dark:text-white placeholder-slate-400 transition-colors"
            />
          </div>
        </div>

        {/* Error Message */}
        {!!errorMessage && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`my-learning-skeleton-${index}`}
                className="h-36 rounded-2xl border border-slate-200 bg-white animate-pulse dark:border-white/[0.08] dark:bg-slate-800/60"
              />
            ))}
          </div>
        )}

        {/* Course List */}
        {!isLoading && filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {activeTab === "wishlist" ? "Chưa có khóa học yêu thích" : activeTab === "learning" ? "Chưa có khóa học đang học" : activeTab === "completed" ? "Chưa hoàn thành khóa học nào" : "Không tìm thấy khóa học"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {activeTab === "wishlist"
                ? "Hãy thêm khóa học vào danh sách yêu thích"
                : "Hãy đăng ký khóa học để bắt đầu học"}
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Khám phá khóa học
            </button>
          </div>
        ) : !isLoading ? (
          <div className="space-y-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {/* Thumbnail */}
                  <div
                    onClick={() =>
                      activeTab === "learning"
                        ? navigate(`/learning/${course.id}`)
                        : navigate(`/course/${course.id}`)
                    }
                    className={`w-full sm:w-48 h-28 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center cursor-pointer flex-shrink-0 group-hover:shadow-lg transition-shadow relative overflow-hidden`}
                  >
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <svg className="w-10 h-10 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </>
                    )}
                    {course.progress >= 100 && (
                      <div className="absolute top-2 right-2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() =>
                        activeTab === "learning"
                          ? navigate(`/learning/${course.id}`)
                          : navigate(`/course/${course.id}`)
                      }
                      className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {course.instructor}
                      {course.lastAccess && ` • Truy cập: ${course.lastAccess}`}
                      {course.completedDate && ` • Hoàn thành: ${course.completedDate}`}
                    </p>

                    {/* Rating */}
                    {course.rating > 0 && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-sm font-bold text-amber-500">{course.rating}</span>
                        <StarRating rating={course.rating} size="xs" />
                      </div>
                    )}

                    {/* Progress bar (for learning tab) */}
                    {activeTab === "learning" && (
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                          {course.progress}% ({course.completedLessons}/{course.lessons} bài)
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {activeTab === "learning" && (
                        <button
                          onClick={() => navigate(`/learning/${course.id}`)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                        >
                          Tiếp tục học
                        </button>
                      )}
                      {activeTab === "completed" && course.hasCertificate && (
                        <button
                          onClick={() => navigate("/certificates")}
                          className="px-4 py-2 bg-amber-500 text-white rounded-lg text-xs font-semibold hover:bg-amber-600 transition-colors"
                        >
                          Xem chứng chỉ
                        </button>
                      )}
                      {activeTab === "completed" && (
                        <button
                          onClick={() => navigate(`/learning/${course.id}`)}
                          className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                          Xem lại
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MyLearning;
