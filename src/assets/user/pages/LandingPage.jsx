import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  // --- MOCK DATA TÍCH HỢP TRÊN LANDING PAGE ---
  const featuredCourses = [
    {
      id: 1,
      title: "Lập trình Backend chuyên sâu với Java Spring Boot & Kafka",
      instructor: "Trần Minh Thu",
      rating: 4.9,
      students: 2150,
      price: "899.000đ",
      thumbnail: "bg-gradient-to-br from-gray-800 to-gray-900",
      badge: "Bestseller",
    },
    {
      id: 2,
      title: "Product Owner Thực chiến: Quản lý Backlog & Lên kế hoạch Sprint",
      instructor: "Lê Hoàng Hải",
      rating: 4.8,
      students: 1840,
      price: "599.000đ",
      thumbnail: "bg-gradient-to-br from-blue-600 to-indigo-800",
      badge: "Mới",
    },
    {
      id: 3,
      title: "Ngữ pháp Tiếng Trung HSK 4 - Luyện viết và Sắp xếp câu",
      instructor: "Wang Lin",
      rating: 4.9,
      students: 3200,
      price: "Miễn phí",
      thumbnail: "bg-gradient-to-br from-red-500 to-rose-700",
      badge: "Phổ biến",
    },
  ];

  const recentArticles = [
    {
      id: 1,
      title:
        "Triển khai Outbox Pattern để đảm bảo tính nhất quán dữ liệu trong Microservices",
      category: "System Architecture",
      date: "15/04/2026",
      readTime: "6 phút đọc",
      image: "bg-indigo-100",
    },
    {
      id: 2,
      title:
        "Hiểu đúng về Systemic Functional Linguistics (SFL) trong phân tích văn bản",
      category: "Linguistics",
      date: "12/04/2026",
      readTime: "8 phút đọc",
      image: "bg-emerald-100",
    },
    {
      id: 3,
      title: "Tối ưu hóa hiệu suất React App với useMemo và useCallback",
      category: "Frontend Dev",
      date: "10/04/2026",
      readTime: "5 phút đọc",
      image: "bg-blue-100",
    },
  ];

  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen font-sans">
      {/* --- 1. TOP NAVIGATION (LANDING) --- */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-[#1a2b4c] cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.225 8.163c-.029.124-.122.22-.24.26a9.022 9.022 0 00-7.375.753z" />
            </svg>
            <span className="text-xl font-black tracking-tight font-serif">
              BTM-Learning
            </span>
          </div>

          {/* Center Links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#courses"
              className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
            >
              Khóa học
            </a>
            <a
              href="#articles"
              className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
            >
              Bài viết
            </a>
            <a
              href="#about"
              className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors"
            >
              Về chúng tôi
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/auth/login")}
              className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors hidden sm:block"
            >
              Đăng nhập
            </button>
            <button
              onClick={() => navigate("/auth/register")}
              className="bg-[#1a2b4c] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-opacity-90 transition-colors shadow-sm"
            >
              Đăng ký ngay
            </button>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION --- */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider mb-2">
            Nền tảng học tập trực tuyến
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight font-serif">
            Nâng tầm kiến thức,
            <br /> <span className="text-blue-600">Kiến tạo tương lai.</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-lg mx-auto md:mx-0">
            Khám phá hàng trăm khóa học chất lượng cao từ công nghệ, ngôn ngữ
            đến kỹ năng quản lý dự án. Học mọi lúc, mọi nơi với sự hỗ trợ của
            AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
            <button className="w-full sm:w-auto bg-[#1a2b4c] text-white px-8 py-3.5 rounded-full text-base font-bold hover:bg-opacity-90 transition-colors shadow-lg shadow-blue-900/20">
              Khám phá khóa học
            </button>
            <button className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-full text-base font-bold hover:bg-gray-50 transition-colors">
              Tìm hiểu thêm
            </button>
          </div>

          <div className="pt-6 flex items-center gap-6 justify-center md:justify-start text-sm font-bold text-gray-500">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-300"></div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-400"></div>
            </div>
            <p>
              Hơn <span className="text-gray-900">50,000+</span> học viên đã tin
              tưởng.
            </p>
          </div>
        </div>

        {/* Hero Graphic / Abstract Element */}
        <div className="flex-1 relative w-full max-w-lg aspect-square">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] transform rotate-3"></div>
          <div className="absolute inset-0 bg-white border border-gray-100 rounded-[3rem] shadow-xl overflow-hidden flex flex-col items-center justify-center p-8">
            {/* Minimalist Graphic replacing an image */}
            <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-blue-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <h3 className="font-bold text-gray-800 text-xl">
                Học tập không giới hạn
              </h3>
              <p className="text-sm text-gray-500 mt-2 text-center">
                Giao diện học tập hiện đại, sạch sẽ và tối ưu hóa sự tập trung.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. FEATURES SECTION --- */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 font-serif mb-4">
              Tại sao chọn BTM-Learning?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng tôi tập trung vào trải nghiệm học tập thực tế, loại bỏ những
              lý thuyết rườm rà để mang lại hiệu quả cao nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Dự án thực tế
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Học qua việc xây dựng các dự án thực tế. Kiến thức được thiết kế
                bám sát yêu cầu từ doanh nghiệp.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tích hợp AI Trợ lý
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Giải đáp thắc mắc 24/7 ngay trong khung chat bài học. Tự động
                chấm điểm và đưa ra nhận xét chi tiết.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Cấp chứng chỉ
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                Nhận chứng chỉ điện tử uy tín sau khi hoàn thành, dễ dàng thêm
                trực tiếp vào hồ sơ LinkedIn của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. FEATURED COURSES --- */}
      <section id="courses" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 font-serif mb-2">
              Khóa học nổi bật
            </h2>
            <p className="text-gray-500">
              Những lộ trình được học viên đăng ký nhiều nhất.
            </p>
          </div>
          <button className="text-blue-600 font-bold hover:text-blue-800 transition-colors hidden sm:block">
            Xem tất cả →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div
                className={`h-48 ${course.thumbnail} relative overflow-hidden`}
              >
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1.5 rounded-md text-gray-900">
                  {course.badge}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-3 group-hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Bởi: {course.instructor}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                    <span className="text-amber-500 text-lg">★</span>
                    <span>{course.rating}</span>
                    <span className="text-gray-400 font-normal">
                      ({course.students})
                    </span>
                  </div>
                  <span
                    className={`font-black ${course.price === "Miễn phí" ? "text-green-600" : "text-[#1a2b4c]"}`}
                  >
                    {course.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- 5. ARTICLES & BLOG --- */}
      <section
        id="articles"
        className="bg-gray-50 py-20 border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 font-serif mb-2">
                Góc kiến thức
              </h2>
              <p className="text-gray-500">
                Cập nhật xu hướng công nghệ và kỹ năng làm việc mới nhất.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div
                  className={`h-40 ${article.image} relative overflow-hidden flex items-center justify-center`}
                >
                  {/* Minimal Icon instead of photo */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-400 opacity-50"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <div className="p-6">
                  <div className="flex gap-3 text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">
                    <span className="text-blue-600">{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-4">{article.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. FOOTER --- */}
      <footer className="bg-[#0f172a] text-gray-400 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.225 8.163c-.029.124-.122.22-.24.26a9.022 9.022 0 00-7.375.753z" />
              </svg>
              <span className="text-xl font-black tracking-tight font-serif">
                BTM-Learning
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Nền tảng học tập trực tuyến kết hợp AI, cung cấp các giải pháp
              giáo dục tối giản và hiệu quả.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
              Hệ sinh thái
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Danh sách Khóa học
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog & Kiến thức
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  AI Trợ lý học tập
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
              Hỗ trợ
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Điều khoản dịch vụ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">
              Theo dõi chúng tôi
            </h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  className="h-5 w-5"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-sm text-center">
          &copy; {new Date().getFullYear()} BTM-Learning. Đã đăng ký bản quyền.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
