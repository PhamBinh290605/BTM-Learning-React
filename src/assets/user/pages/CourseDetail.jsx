import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import StarRating from "../components/StarRating";

// import { getCourseById } from "../../../api/courses";

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedSections, setExpandedSections] = useState([0]);

  // ─── MOCK DATA ───
  const course = {
    id: 1,
    title: "Lập trình ReactJS & Next.js Fullstack 2026",
    description:
      "Khóa học toàn diện giúp bạn làm chủ ReactJS và Next.js từ cơ bản đến nâng cao. Bạn sẽ xây dựng các ứng dụng web thực tế với các công nghệ hiện đại nhất.",
    longDescription:
      "Trong khóa học này, bạn sẽ học cách xây dựng ứng dụng web fullstack sử dụng ReactJS 19, Next.js 15, TypeScript, TailwindCSS, Prisma, PostgreSQL và nhiều công nghệ khác. Khóa học bao gồm hơn 42 giờ video bài giảng, 200+ bài tập thực hành, và 5 dự án thực tế hoàn chỉnh.",
    instructor: "Minh Hoàng",
    instructorTitle: "Senior Frontend Developer",
    instructorAvatar: "MH",
    instructorBio: "10+ năm kinh nghiệm phát triển web. Từng làm việc tại Google, FPT Software. Đã đào tạo hơn 50,000 học viên trực tuyến.",
    category: "Công nghệ thông tin",
    price: 599000,
    originalPrice: 1299000,
    rating: 4.8,
    reviewCount: 2840,
    students: 12400,
    duration: "42 giờ",
    lessons: 186,
    level: "Trung cấp",
    language: "Tiếng Việt",
    lastUpdated: "04/2026",
    color: "from-blue-500 to-cyan-400",
    features: [
      "42 giờ video bài giảng HD",
      "186 bài học chi tiết",
      "200+ bài tập thực hành",
      "5 dự án thực tế hoàn chỉnh",
      "Chứng chỉ hoàn thành",
      "Hỗ trợ trọn đời",
      "Cập nhật miễn phí",
      "Cộng đồng học tập",
    ],
    requirements: [
      "Kiến thức HTML, CSS, JavaScript cơ bản",
      "Máy tính có kết nối internet",
      "Tinh thần ham học hỏi",
    ],
    sections: [
      {
        title: "Giới thiệu & Cài đặt",
        lessons: [
          { title: "Tổng quan khóa học", duration: "5:30", free: true },
          { title: "Cài đặt Node.js & VS Code", duration: "12:00", free: true },
          { title: "Tạo dự án React đầu tiên", duration: "15:00", free: false },
        ],
      },
      {
        title: "React Fundamentals",
        lessons: [
          { title: "JSX & Components", duration: "18:00", free: false },
          { title: "Props & State", duration: "22:00", free: false },
          { title: "Event Handling", duration: "14:00", free: false },
          { title: "Conditional Rendering", duration: "10:00", free: false },
          { title: "Lists & Keys", duration: "12:00", free: false },
        ],
      },
      {
        title: "React Hooks",
        lessons: [
          { title: "useState Deep Dive", duration: "20:00", free: false },
          { title: "useEffect & Side Effects", duration: "25:00", free: false },
          { title: "useContext & Global State", duration: "18:00", free: false },
          { title: "Custom Hooks", duration: "22:00", free: false },
        ],
      },
      {
        title: "Next.js & Server Components",
        lessons: [
          { title: "Giới thiệu Next.js 15", duration: "15:00", free: false },
          { title: "App Router & Layouts", duration: "20:00", free: false },
          { title: "Server vs Client Components", duration: "25:00", free: false },
          { title: "Data Fetching", duration: "30:00", free: false },
          { title: "API Routes", duration: "18:00", free: false },
        ],
      },
    ],
    reviews: [
      { user: "Nguyễn Văn A", avatar: "VA", rating: 5, date: "15/04/2026", comment: "Khóa học rất tuyệt vời! Giảng viên giải thích rõ ràng, dễ hiểu. Sau khóa học tôi đã có thể tự build được dự án cá nhân." },
      { user: "Trần Thị B", avatar: "TB", rating: 4.5, date: "10/04/2026", comment: "Nội dung chất lượng, cập nhật mới nhất. Chỉ hơi tiếc là phần về testing hơi ngắn." },
      { user: "Lê Minh C", avatar: "MC", rating: 5, date: "05/04/2026", comment: "Đây là khóa học React tốt nhất mà tôi từng học. Worth every đồng!" },
    ],
  };

  const formatPrice = (price) => {
    if (price === 0) return "Miễn phí";
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const discount = Math.round((1 - course.price / course.originalPrice) * 100);

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
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {course.instructorAvatar}
                </div>
                <span className="text-white/90 font-medium">{course.instructor}</span>
              </div>
            </div>

            {/* Right - Purchase Card (Desktop) */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className={`h-44 bg-gradient-to-br ${course.color} flex items-center justify-center`}>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                    <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
                      {formatPrice(course.price)}
                    </span>
                    <span className="text-lg text-slate-400 line-through">
                      {formatPrice(course.originalPrice)}
                    </span>
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-md text-xs font-bold">
                      -{discount}%
                    </span>
                  </div>
                  <button
                    onClick={() => navigate("/auth/login")}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-indigo-500/25 transition-all mb-3 active:scale-[0.98]"
                  >
                    Đăng ký ngay
                  </button>
                  <button className="w-full py-3 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-xl font-medium text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                    Thêm vào yêu thích
                  </button>
                  <div className="mt-5 space-y-3 text-sm">
                    {[
                      { icon: "⏱️", text: `${course.duration} học liệu` },
                      { icon: "📚", text: `${course.lessons} bài học` },
                      { icon: "📱", text: "Truy cập mọi thiết bị" },
                      { icon: "🏆", text: "Chứng chỉ hoàn thành" },
                      { icon: "♾️", text: "Truy cập trọn đời" },
                    ].map((item) => (
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
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            {formatPrice(course.price)}
          </span>
          <span className="text-sm text-slate-400 line-through ml-2">
            {formatPrice(course.originalPrice)}
          </span>
        </div>
        <button className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-sm">
          Đăng ký ngay
        </button>
      </div>

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
                    {course.sections.length} chương • {totalLessons} bài học • {course.duration}
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
                          {section.lessons.map((lesson, li) => (
                            <div
                              key={li}
                              className="flex items-center justify-between px-4 py-3 pl-12 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
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
                              </div>
                              <span className="text-xs text-slate-400">{lesson.duration}</span>
                            </div>
                          ))}
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
                    {[5, 4, 3, 2, 1].map((star) => {
                      const percent = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1;
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
                {course.reviews.map((review, i) => (
                  <div key={i} className="p-5 bg-white dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-white/[0.06]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                          {review.avatar}
                        </div>
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
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    {course.instructorAvatar}
                  </div>
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
                        4.8 đánh giá
                      </span>
                      <span>50,000+ học viên</span>
                      <span>15 khóa học</span>
                    </div>
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
