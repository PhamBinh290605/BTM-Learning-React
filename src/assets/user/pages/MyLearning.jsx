import { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating";

// import { getMyCourses } from "../../../api/courses";

const MyLearning = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("learning");
  const [searchTerm, setSearchTerm] = useState("");

  // ─── MOCK DATA ───
  const courses = {
    learning: [
      { id: 1, title: "Lập trình ReactJS & Next.js Fullstack 2026", instructor: "Minh Hoàng", progress: 65, lastAccess: "Hôm nay", color: "from-blue-500 to-cyan-400", lessons: 186, completedLessons: 121, rating: 4.8 },
      { id: 2, title: "Python cho Data Science & Machine Learning", instructor: "Quang Đức", progress: 32, lastAccess: "Hôm qua", color: "from-emerald-500 to-teal-500", lessons: 200, completedLessons: 64, rating: 4.7 },
      { id: 3, title: "Thiết kế UI/UX chuyên nghiệp với Figma", instructor: "Thu Hà", progress: 78, lastAccess: "2 ngày trước", color: "from-purple-500 to-pink-500", lessons: 120, completedLessons: 94, rating: 4.9 },
    ],
    completed: [
      { id: 4, title: "Digital Marketing A-Z cho người mới", instructor: "Thanh Tùng", progress: 100, completedDate: "10/04/2026", color: "from-orange-400 to-red-500", lessons: 98, completedLessons: 98, rating: 4.6, hasCertificate: true },
      { id: 5, title: "Tiếng Anh giao tiếp chuyên ngành IT", instructor: "Ngọc Anh", progress: 100, completedDate: "01/04/2026", color: "from-amber-400 to-orange-500", lessons: 60, completedLessons: 60, rating: 4.5, hasCertificate: true },
      { id: 6, title: "Adobe Photoshop từ A đến Z", instructor: "Bảo Khanh", progress: 100, completedDate: "15/03/2026", color: "from-sky-500 to-blue-600", lessons: 85, completedLessons: 85, rating: 4.4, hasCertificate: false },
      { id: 7, title: "HTML & CSS cơ bản", instructor: "Minh Hoàng", progress: 100, completedDate: "01/03/2026", color: "from-pink-400 to-rose-500", lessons: 45, completedLessons: 45, rating: 4.3, hasCertificate: true },
      { id: 8, title: "JavaScript ES6+", instructor: "Minh Hoàng", progress: 100, completedDate: "20/02/2026", color: "from-yellow-400 to-amber-500", lessons: 72, completedLessons: 72, rating: 4.7, hasCertificate: true },
    ],
    wishlist: [
      { id: 9, title: "Làm chủ Docker, Kubernetes & CI/CD", instructor: "Văn Nam", price: 699000, color: "from-gray-600 to-gray-800", rating: 4.8, students: 4300 },
      { id: 10, title: "Flutter & Dart - Ứng dụng di động", instructor: "Phúc Thịnh", price: 649000, color: "from-cyan-500 to-blue-500", rating: 4.6, students: 3200 },
    ],
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

        {/* Course List */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
              <span className="text-3xl">📚</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {activeTab === "wishlist" ? "Chưa có khóa học yêu thích" : "Không tìm thấy khóa học"}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              {activeTab === "wishlist"
                ? "Hãy thêm khóa học vào danh sách yêu thích"
                : "Thử tìm kiếm với từ khóa khác"}
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Khám phá khóa học
            </button>
          </div>
        ) : (
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
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    <svg className="w-10 h-10 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    {course.progress === 100 && (
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
                    {course.rating && (
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
                      {activeTab === "wishlist" && (
                        <>
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition-colors">
                            Đăng ký - {new Intl.NumberFormat("vi-VN").format(course.price)}đ
                          </button>
                          <button className="px-4 py-2 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;
