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
    },
  ];

  return (
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
    </div>
  );
};

export default HomePage;
