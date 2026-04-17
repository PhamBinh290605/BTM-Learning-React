<<<<<<< HEAD
import React from "react";
const HomePage = () => {
  // --- MOCK DATA ---
  const inProgressCourses = [
    {
      id: 1,
      title: "Xây dựng hệ thống Backend với Spring Boot & Kafka",
      instructor: "Trần Minh Thu",
      progress: 68,
      lastAccessed: "2 giờ trước",
      thumbnail: "bg-gradient-to-br from-gray-800 to-gray-900",
      icon: "☕",
      nextLesson: "Bài 12: Triển khai Outbox Pattern",
    },
    {
      id: 2,
      title: "Ngữ pháp Tiếng Trung Trung cấp (HSK 4)",
      instructor: "Wang Lin",
      progress: 32,
      lastAccessed: "Hôm qua",
      thumbnail: "bg-gradient-to-br from-red-600 to-red-800",
      icon: "文",
      nextLesson: 'Bài 5: Phân biệt cấu trúc câu chữ "把"',
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Bài kiểm tra: Phân tích Diễn ngôn (Discourse Analysis)",
      course: "Ngôn ngữ học Tiếng Anh chuyên sâu",
      dueDate: "19/04/2026",
      timeLeft: "2 ngày nữa",
      type: "quiz",
      status: "pending",
    },
    {
      id: 2,
      title: "Nộp tài liệu: System Architecture & Database Schema",
      course: "Kỹ năng Quản lý Dự án Agile cho Product Owner",
      dueDate: "20/04/2026",
      timeLeft: "3 ngày nữa",
      type: "assignment",
      status: "pending",
    },
  ];

  const recommendedCourses = [
    {
      id: 3,
      title: "Microservices: Redis Caching & Transaction Management",
      category: "Công nghệ thông tin",
      rating: 4.9,
      students: 1250,
      image: "bg-gradient-to-r from-blue-600 to-indigo-700",
    },
    {
      id: 4,
      title: "Product Owner Masterclass: Từ User Story đến Release",
      category: "Quản lý dự án",
      rating: 4.8,
      students: 840,
      image: "bg-gradient-to-r from-emerald-500 to-teal-700",
    },
    {
      id: 5,
      title: "Systemic Functional Linguistics (SFL) Ứng dụng",
      category: "Ngoại ngữ",
      rating: 4.7,
      students: 420,
      image: "bg-gradient-to-r from-amber-500 to-orange-600",
=======
﻿import { useNavigate } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import CourseCard from "../components/CourseCard";
import CategoryCard from "../components/CategoryCard";
import TestimonialCard from "../components/TestimonialCard";
import StatCounter from "../components/StatCounter";

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
>>>>>>> thai-feature/login
    },
  ];

  return (
<<<<<<< HEAD
    <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
      {/* 1. HERO BANNER (Chào mừng & Thống kê nhanh) */}
      <div className="bg-[#1a2b4c] rounded-2xl p-8 md:p-10 text-white relative overflow-hidden shadow-lg">
        {/* Pattern trang trí */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="text-blue-200 font-medium mb-1">
              Thứ Sáu, 17 Tháng 4, 2026
            </p>
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">
              Chào mừng trở lại!
            </h1>
            <p className="text-gray-300 max-w-lg leading-relaxed">
              Bạn đang giữ nhịp độ học tập rất tốt. Hãy tiếp tục hoàn thành các
              bài học hôm nay để đạt mục tiêu tuần nhé.
            </p>
          </div>

          <div className="flex gap-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[120px] text-center">
              <p className="text-3xl font-black text-white mb-1">4</p>
              <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">
                Khóa đang học
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 min-w-[120px] text-center">
              <p className="text-3xl font-black text-white mb-1">12</p>
              <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">
                Chứng chỉ
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CỘT ĐÔI: TIẾP TỤC HỌC TẬP & NHIỆM VỤ SẮP TỚI */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cột trái: Đang học (In Progress) */}
        <div className="flex-[2] space-y-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                clipRule="evenodd"
              />
            </svg>
            Tiếp tục học tập
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-4 mb-3">
                    <div
                      className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl shadow-inner shrink-0 ${course.thumbnail}`}
                    >
                      {course.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        GV: {course.instructor}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-100 mb-4">
                    <p className="text-xs text-gray-500 font-medium mb-1">
                      Bài tiếp theo:
                    </p>
                    <p className="text-sm font-bold text-gray-800 line-clamp-1">
                      {course.nextLesson}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1.5">
                    <span className="text-xs font-bold text-blue-600">
                      {course.progress}% hoàn thành
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Truy cập: {course.lastAccessed}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cột phải: Nhiệm vụ sắp tới (Deadlines) */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-orange-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Nhiệm vụ cần làm
            </h2>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-800">
              Xem Lịch
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 hover:bg-gray-50 transition-colors flex gap-4"
              >
                <div className="shrink-0 mt-0.5">
                  {task.type === "quiz" ? (
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm font-bold text-gray-900 truncate"
                    title={task.title}
                  >
                    {task.title}
                  </h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {task.course}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {task.timeLeft}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. GỢI Ý KHÓA HỌC DÀNH CHO BẠN */}
      <div className="space-y-4 pt-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-amber-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Gợi ý dành riêng cho bạn
          </h2>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-800">
            Khám phá thêm
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
            >
              <div className={`h-36 ${course.image} relative overflow-hidden`}>
                {/* Overlay khi hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold shadow-md transform translate-y-4 group-hover:translate-y-0 transition-all">
                    Xem chi tiết
                  </button>
                </div>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-gray-800">
                  {course.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 leading-tight mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
                  {course.title}
                </h3>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                    <span className="text-amber-500 text-lg">★</span>
                    <span>{course.rating}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {course.students.toLocaleString()} học viên
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
=======
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
>>>>>>> thai-feature/login
    </div>
  );
};

export default HomePage;
