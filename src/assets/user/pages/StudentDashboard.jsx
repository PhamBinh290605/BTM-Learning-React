import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userApi from "../../../api/userApi";
import enrollmentApi from "../../../api/enrollmentApi";
import lessonApi from "../../../api/lessonApi";
import certificateApi from "../../../api/certificateApi";
import { resolveMediaUrl } from "../../../utils/media";
import { getAccessToken } from "../../../utils/session";
import { getUserIdFromToken } from "../../../utils/jwt";

const COURSE_COLOR_POOL = [
  "from-blue-500 to-cyan-400",
  "from-emerald-500 to-teal-500",
  "from-purple-500 to-pink-500",
  "from-orange-400 to-red-500",
  "from-amber-400 to-orange-500",
  "from-sky-500 to-blue-600",
  "from-cyan-500 to-blue-500",
  "from-pink-400 to-rose-500",
];

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({ name: "Người dùng", avatar: "U", avatarUrl: "" });
  const [stats, setStats] = useState([
    { label: "Khóa học", value: "0", icon: "📚", color: "from-blue-500 to-cyan-400" },
    { label: "Đang học", value: "0", icon: "▶️", color: "from-violet-500 to-purple-500" },
    { label: "Hoàn thành", value: "0", icon: "✅", color: "from-emerald-500 to-teal-500" },
    { label: "Chứng chỉ", value: "0", icon: "🏆", color: "from-amber-400 to-orange-500" },
  ]);
  const [continueLearning, setContinueLearning] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setIsLoading(true);

        const token = getAccessToken();
        if (!token) {
          setStats([
            { label: "Khóa học", value: "0", icon: "📚", color: "from-blue-500 to-cyan-400" },
            { label: "Đang học", value: "0", icon: "▶️", color: "from-violet-500 to-purple-500" },
            { label: "Hoàn thành", value: "0", icon: "✅", color: "from-emerald-500 to-teal-500" },
            { label: "Chứng chỉ", value: "0", icon: "🏆", color: "from-amber-400 to-orange-500" },
          ]);
          setContinueLearning([]);
          return;
        }

        const profileResponse = await userApi.getMyProfile().catch(() => null);

        if (!isMounted) return;

        const profileData = profileResponse?.data?.result;
        const profileUserId = toNumber(profileData?.id, 0);
        const tokenUserId = toNumber(getUserIdFromToken(token), 0);
        const currentUserId = profileUserId > 0 ? profileUserId : tokenUserId;

        const [enrollmentResponse, certResponse] = await Promise.all([
          currentUserId > 0
            ? enrollmentApi.searchEnrollments({ pageNo: 0, pageSize: 100, userId: currentUserId }).catch(() => null)
            : Promise.resolve(null),
          certificateApi.getAllCertificates().catch(() => null),
        ]);

        if (!isMounted) return;

        // Parse user profile
        if (profileData) {
          const fullName = profileData.fullName || "Người dùng";
          const initials = fullName
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() || "")
            .join("") || "U";

          setUser({
            name: fullName,
            avatar: initials,
            avatarUrl: resolveMediaUrl(profileData.avatarUrl),
          });
        }

        // Parse enrollments
        const enrollmentPage = enrollmentResponse?.data?.result;
        const rawEnrollments = Array.isArray(enrollmentPage?.content)
          ? enrollmentPage.content
          : Array.isArray(enrollmentPage)
            ? enrollmentPage
            : [];

        const enrollments = rawEnrollments.filter((enrollment) => {
          const userId = toNumber(enrollment?.user?.id || enrollment?.userId, 0);
          const status = String(enrollment?.status || "").toUpperCase();
          const paymentStatus = String(enrollment?.paymentStatus || "").toUpperCase();

          const normalizedStatus = status || (paymentStatus === "FAILED" ? "CANCELLED" : "ACTIVE");
          const isActiveStatus = normalizedStatus === "ACTIVE"
            || normalizedStatus === "COMPLETED"
            || normalizedStatus === "IN_PROGRESS";

          if (!isActiveStatus) {
            return false;
          }

          if (currentUserId > 0) {
            return userId === 0 || userId === currentUserId;
          }

          return false;
        });

        // Fetch progress for each course
        const coursesWithProgress = await Promise.all(
          enrollments.map(async (enrollment, index) => {
            const course = enrollment.course || {};
            const courseId = course.id || enrollment.courseId;

            let progressPercent = 0;
            let lastLesson = "";

            try {
              const progressResponse = await lessonApi.getCourseProgress(courseId);
              const progressData = progressResponse?.data?.result;

              if (progressData) {
                progressPercent = toNumber(progressData.progressPercent);

                // Find the first non-completed lesson
                const sections = progressData.sections || [];
                for (const section of sections) {
                  for (const lesson of section.lessons || []) {
                    if (String(lesson.status || "").toUpperCase() !== "COMPLETED") {
                      lastLesson = lesson.lessonTitle || lesson.title || "";
                      break;
                    }
                  }
                  if (lastLesson) break;
                }
              }
            } catch {
              // Progress fetch failed
            }

            return {
              id: courseId,
              title: course.title || enrollment.courseTitle || "Khóa học",
              instructor:
                course.instructor?.fullName ||
                enrollment.instructorName ||
                "BTM Learning",
              progress: progressPercent,
              lastLesson: lastLesson || "Chưa bắt đầu",
              color: COURSE_COLOR_POOL[index % COURSE_COLOR_POOL.length],
              thumbnailUrl: resolveMediaUrl(course.thumbnailUrl),
            };
          })
        );

        if (!isMounted) return;

        // Categorize
        const learning = coursesWithProgress.filter((c) => c.progress < 100);
        const completed = coursesWithProgress.filter((c) => c.progress >= 100);

        // Parse certificates
        const certList = Array.isArray(certResponse?.data?.result)
          ? certResponse.data.result
          : [];

        // Update stats
        setStats([
          { label: "Khóa học", value: String(coursesWithProgress.length), icon: "📚", color: "from-blue-500 to-cyan-400" },
          { label: "Đang học", value: String(learning.length), icon: "▶️", color: "from-violet-500 to-purple-500" },
          { label: "Hoàn thành", value: String(completed.length), icon: "✅", color: "from-emerald-500 to-teal-500" },
          { label: "Chứng chỉ", value: String(certList.length), icon: "🏆", color: "from-amber-400 to-orange-500" },
        ]);

        // Continue learning: top 3 courses in progress
        setContinueLearning(learning.slice(0, 3));
      } catch {
        // Silently fail - stats will show 0
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
          <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`dash-stat-skeleton-${i}`} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            ))}
          </div>
          <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-900 dark:via-violet-900 dark:to-purple-900 rounded-2xl p-8 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-violet-300/10 rounded-full translate-y-1/2 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white text-xl font-bold border border-white/20 overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.avatar
                )}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">
                  Xin chào, {user.name}! 👋
                </h1>
                <p className="text-white/70 mt-1">
                  Hãy tiếp tục hành trình học tập của bạn
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200 dark:border-white/[0.06] shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-slate-500 dark:text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Tiếp tục học
              </h2>
              <button
                onClick={() => navigate("/my-learning")}
                className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
              >
                Xem tất cả
              </button>
            </div>

            {continueLearning.length === 0 ? (
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Chưa có khóa học đang học</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Hãy đăng ký khóa học để bắt đầu</p>
                <button
                  onClick={() => navigate("/courses")}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Khám phá khóa học
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {continueLearning.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => navigate(`/learning/${course.id}`)}
                    className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0 overflow-hidden`}>
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {course.instructor} • Bài tiếp: {course.lastLesson}
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                            {course.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Links */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Truy cập nhanh
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate("/my-learning")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left"
                >
                  <span className="text-lg">📚</span>
                  Khóa học của tôi
                </button>
                <button
                  onClick={() => navigate("/certificates")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left"
                >
                  <span className="text-lg">🏆</span>
                  Chứng chỉ
                </button>
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left"
                >
                  <span className="text-lg">👤</span>
                  Hồ sơ cá nhân
                </button>
                <button
                  onClick={() => navigate("/courses")}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-left"
                >
                  <span className="text-lg">🔍</span>
                  Khám phá khóa học
                </button>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-2">Tổng quan học tập</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Tổng khóa học</span>
                  <span className="font-bold">{stats[0].value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Đang tiến hành</span>
                  <span className="font-bold">{stats[1].value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Đã hoàn thành</span>
                  <span className="font-bold">{stats[2].value}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Chứng chỉ đạt được</span>
                  <span className="font-bold">{stats[3].value}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
