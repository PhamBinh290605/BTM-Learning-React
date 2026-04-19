import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CourseCard from "../components/CourseCard";
import CategoryCard from "../components/CategoryCard";
import TestimonialCard from "../components/TestimonialCard";
import StatCounter from "../components/StatCounter";
import AIRecommendationsSection from "../components/AIRecommendationsSection";

// import { getCourses, getCategories } from "../../../api/courses";

const HomePage = () => {
  const navigate = useNavigate();

  // ─── MOCK DATA ───
  const CATEGORIES = [
    { id: 1, name: "Công nghệ thông tin", icon: "💻", courseCount: 1240, color: "from-blue-500 to-cyan-400" },
    { id: 2, name: "Thiết kế đồ họa", icon: "🎨", courseCount: 856, color: "from-purple-500 to-pink-500" },
    { id: 3, name: "Marketing", icon: "📢", courseCount: 642, color: "from-orange-400 to-red-500" },
    { id: 4, name: "Kinh doanh", icon: "💼", courseCount: 534, color: "from-emerald-500 to-teal-500" },
    { id: 5, name: "Ngoại ngữ", icon: "🌍", courseCount: 928, color: "from-amber-400 to-orange-500" },
    { id: 6, name: "Khoa học dữ liệu", icon: "📊", courseCount: 412, color: "from-indigo-500 to-violet-500" },
  ];

  const POPULAR_COURSES = [
    {
      id: 1,
      title: "Lập trình ReactJS & Next.js Fullstack 2026",
      instructor: "Minh Hoàng",
      category: "Lập trình",
      price: 599000,
      rating: 4.8,
      students: 12400,
      reviewCount: 2840,
      color: "from-blue-500 to-cyan-400",
    },
    {
      id: 2,
      title: "Thiết kế UI/UX chuyên nghiệp với Figma",
      instructor: "Thu Hà",
      category: "Thiết kế",
      price: 0,
      rating: 4.9,
      students: 8500,
      reviewCount: 1920,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      title: "Python cho Data Science & Machine Learning",
      instructor: "Quang Đức",
      category: "Data Science",
      price: 799000,
      rating: 4.7,
      students: 6200,
      reviewCount: 1540,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 4,
      title: "Digital Marketing A-Z cho người mới bắt đầu",
      instructor: "Thanh Tùng",
      category: "Marketing",
      price: 399000,
      rating: 4.6,
      students: 9800,
      reviewCount: 2100,
      color: "from-orange-400 to-red-500",
    },
    {
      id: 5,
      title: "Làm chủ Docker, Kubernetes & CI/CD Pipeline",
      instructor: "Văn Nam",
      category: "DevOps",
      price: 699000,
      rating: 4.8,
      students: 4300,
      reviewCount: 980,
      color: "from-gray-600 to-gray-800",
    },
    {
      id: 6,
      title: "Tiếng Anh giao tiếp chuyên ngành IT",
      instructor: "Ngọc Anh",
      category: "Ngoại ngữ",
      price: 299000,
      rating: 4.5,
      students: 15600,
      reviewCount: 3400,
      color: "from-amber-400 to-orange-500",
    },
  ];

  const TESTIMONIALS = [
    {
      name: "Nguyễn Văn An",
      role: "Frontend Developer tại FPT Software",
      avatar: "NA",
      avatarColor: "from-blue-500 to-cyan-400",
      quote:
        "Nhờ các khóa học trên BTMLearning, tôi đã chuyển từ nhân viên kế toán sang lập trình viên Frontend chỉ trong 6 tháng. Chất lượng giảng dạy thực sự xuất sắc!",
      rating: 5,
    },
    {
      name: "Trần Thị Bích",
      role: "UI/UX Designer tại Shopee",
      avatar: "TB",
      avatarColor: "from-purple-500 to-pink-500",
      quote:
        "Khóa học UI/UX trên BTMLearning rất thực tế và cập nhật. Giảng viên nhiệt tình, bài tập thực hành phong phú. Tôi đã apply thành công vào Shopee ngay sau khi hoàn thành!",
      rating: 5,
    },
    {
      name: "Lê Minh Tuấn",
      role: "Data Analyst tại VNG",
      avatar: "MT",
      avatarColor: "from-emerald-500 to-teal-500",
      quote:
        "Lộ trình học Data Science được xây dựng rất bài bản. Từ Python cơ bản đến Machine Learning nâng cao, mọi thứ rất logic và dễ hiểu.",
      rating: 4.5,
    },
  ];

  const STAT_ITEMS = [
    {
      end: 12000,
      suffix: "+",
      label: "Khóa học",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      end: 500000,
      suffix: "+",
      label: "Học viên",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      end: 1200,
      suffix: "+",
      label: "Giảng viên",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      end: 98,
      suffix: "%",
      label: "Hài lòng",
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Danh mục <span className="text-indigo-600 dark:text-indigo-400">phổ biến</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Khám phá các lĩnh vực học tập đa dạng với hàng nghìn khóa học chất lượng cao
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onClick={() => navigate("/courses")}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
                Khóa học <span className="text-indigo-600 dark:text-indigo-400">nổi bật</span>
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Được đánh giá cao nhất bởi hàng nghìn học viên
              </p>
            </div>
            <button
              onClick={() => navigate("/courses")}
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            >
              Xem tất cả
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {POPULAR_COURSES.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => navigate(`/course/${course.id}`)}
              />
            ))}
          </div>
          <div className="text-center mt-10 sm:hidden">
            <button
              onClick={() => navigate("/courses")}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
            >
              Xem tất cả khóa học
            </button>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <AIRecommendationsSection />

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Được tin tưởng bởi <span className="text-indigo-600 dark:text-indigo-400">hàng triệu</span> người
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Những con số ấn tượng minh chứng cho chất lượng của nền tảng
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STAT_ITEMS.map((stat) => (
              <StatCounter key={stat.label} {...stat} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Học viên <span className="text-indigo-600 dark:text-indigo-400">nói gì</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Câu chuyện thành công từ cộng đồng học viên BTMLearning
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 dark:from-indigo-900 dark:via-violet-900 dark:to-purple-900" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-300/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
            Bắt đầu hành trình học tập
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
              ngay hôm nay
            </span>
          </h2>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-10">
            Đăng ký miễn phí và truy cập hàng nghìn khóa học chất lượng cao.
            Không cần thẻ tín dụng.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/auth/register")}
              className="px-8 py-3.5 bg-white text-indigo-700 rounded-xl text-sm font-bold hover:bg-slate-100 transition-all shadow-2xl shadow-black/20 active:scale-95"
            >
              Đăng ký miễn phí
            </button>
            <button
              onClick={() => navigate("/courses")}
              className="px-8 py-3.5 bg-white/10 text-white rounded-xl text-sm font-semibold border border-white/20 hover:bg-white/20 transition-all"
            >
              Khám phá khóa học
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
