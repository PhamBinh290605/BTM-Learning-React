import { useNavigate } from "react-router-dom";

// import { getStudentDashboard } from "../../../api/courses";

const StudentDashboard = () => {
  const navigate = useNavigate();

  // ─── MOCK DATA ───
  const user = { name: "Bình Phạm", avatar: "BP" };

  const stats = [
    { label: "Khóa học", value: "8", icon: "📚", color: "from-blue-500 to-cyan-400" },
    { label: "Đang học", value: "3", icon: "▶️", color: "from-violet-500 to-purple-500" },
    { label: "Hoàn thành", value: "5", icon: "✅", color: "from-emerald-500 to-teal-500" },
    { label: "Chứng chỉ", value: "4", icon: "🏆", color: "from-amber-400 to-orange-500" },
  ];

  const continueLearning = [
    {
      id: 1,
      title: "Lập trình ReactJS & Next.js Fullstack 2026",
      instructor: "Minh Hoàng",
      progress: 65,
      lastLesson: "useEffect & Side Effects",
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: 2,
      title: "Python cho Data Science & Machine Learning",
      instructor: "Quang Đức",
      progress: 32,
      lastLesson: "Pandas DataFrame Basics",
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 3,
      title: "Thiết kế UI/UX chuyên nghiệp với Figma",
      instructor: "Thu Hà",
      progress: 78,
      lastLesson: "Design System Components",
      color: "from-purple-500 to-pink-500",
    },
  ];

  const recentActivities = [
    { action: "Hoàn thành bài học", detail: "useEffect & Side Effects", course: "ReactJS Fullstack", time: "2 giờ trước", icon: "✅" },
    { action: "Đạt chứng chỉ", detail: "Digital Marketing A-Z", course: "Marketing", time: "1 ngày trước", icon: "🏆" },
    { action: "Bắt đầu khóa mới", detail: "Python Data Science", course: "Data Science", time: "2 ngày trước", icon: "🚀" },
    { action: "Hoàn thành bài kiểm tra", detail: "React Basics Quiz - 9/10", course: "ReactJS Fullstack", time: "3 ngày trước", icon: "📝" },
  ];

  const upcomingDeadlines = [
    { title: "Bài tập React Hooks", course: "ReactJS Fullstack", due: "20/04/2026", urgent: true },
    { title: "Project cuối khóa", course: "UI/UX Design", due: "25/04/2026", urgent: false },
    { title: "Bài kiểm tra ML", course: "Python Data Science", due: "30/04/2026", urgent: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 dark:from-indigo-900 dark:via-violet-900 dark:to-purple-900 rounded-2xl p-8 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-violet-300/10 rounded-full translate-y-1/2 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white text-xl font-bold border border-white/20">
                {user.avatar}
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
            <div className="space-y-4">
              {continueLearning.map((course) => (
                <div
                  key={course.id}
                  onClick={() => navigate(`/learning/${course.id}`)}
                  className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5 cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center flex-shrink-0`}>
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
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
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Hoạt động gần đây
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">{activity.icon}</span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {activity.action}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {activity.detail}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4">
                Sắp đến hạn
              </h3>
              <div className="space-y-3">
                {upcomingDeadlines.map((deadline, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border ${
                      deadline.urgent
                        ? "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5"
                        : "border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02]"
                    }`}
                  >
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {deadline.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {deadline.course}
                    </p>
                    <p className={`text-xs font-semibold mt-1 ${
                      deadline.urgent ? "text-red-600 dark:text-red-400" : "text-slate-400"
                    }`}>
                      Hạn: {deadline.due}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
