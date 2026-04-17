import React, { useState } from "react";

const MyCourses = () => {
  // --- 1. MOCK DATA: DANH SÁCH KHÓA HỌC CỦA USER ---
  const [courses] = useState([
    {
      id: 1,
      title: "Xây dựng Backend với Java Spring Boot & Hibernate",
      instructor: "Trần Minh Thu",
      category: "Lập trình",
      progress: 65,
      totalLessons: 42,
      completedLessons: 27,
      status: "in-progress", // in-progress, completed, not-started
      lastAccessed: "2 giờ trước",
      thumbnail: "from-blue-600 to-indigo-800",
    },
    {
      id: 2,
      title: "Phân tích Diễn ngôn Tiếng Anh (Discourse Analysis)",
      instructor: "TS. Nguyễn Văn A",
      category: "Ngôn ngữ học",
      progress: 100,
      totalLessons: 24,
      completedLessons: 24,
      status: "completed",
      lastAccessed: "1 tuần trước",
      thumbnail: "from-emerald-500 to-teal-700",
    },
    {
      id: 3,
      title: "Ngữ pháp Tiếng Trung HSK 4 - Luyện viết và Sắp xếp câu",
      instructor: "Wang Lin",
      category: "Ngoại ngữ",
      progress: 12,
      totalLessons: 30,
      completedLessons: 4,
      status: "in-progress",
      lastAccessed: "Hôm qua",
      thumbnail: "from-red-500 to-rose-700",
    },
    {
      id: 4,
      title: "Kiến trúc Hệ thống Phân tán với Kafka & Redis",
      instructor: "Lê Hoàng Hải",
      category: "Hệ thống",
      progress: 0,
      totalLessons: 18,
      completedLessons: 0,
      status: "not-started",
      lastAccessed: "Chưa học",
      thumbnail: "from-gray-700 to-gray-900",
    },
    {
      id: 5,
      title: "Tích hợp Google Maps SDK & Firebase cho Android",
      instructor: "Phạm Tuấn Anh",
      category: "Mobile Dev",
      progress: 88,
      totalLessons: 16,
      completedLessons: 14,
      status: "in-progress",
      lastAccessed: "3 ngày trước",
      thumbnail: "from-orange-400 to-amber-600",
    },
  ]);

  // --- 2. STATE QUẢN LÝ LỌC & TÌM KIẾM ---
  const [activeTab, setActiveTab] = useState("all"); // all, in-progress, completed
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc danh sách khóa học
  const filteredCourses = courses.filter((course) => {
    const matchSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === "all") return matchSearch;
    if (activeTab === "in-progress")
      return (
        matchSearch &&
        (course.status === "in-progress" || course.status === "not-started")
      );
    if (activeTab === "completed")
      return matchSearch && course.status === "completed";
    return matchSearch;
  });

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-12 font-sans">
      {/* --- TOP HEADER --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 font-serif mb-2">
            Khóa học của tôi
          </h1>
          <p className="text-sm text-gray-500">
            Tiếp tục hành trình học tập và theo dõi tiến độ của bạn.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-8 space-y-8">
        {/* TABS & SEARCH BAR */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
          {/* Tabs */}
          <div className="flex w-full md:w-auto p-1 bg-gray-50 rounded-lg border border-gray-100">
            <button
              onClick={() => setActiveTab("all")}
              className={`flex-1 md:w-32 py-2 px-4 text-sm font-bold rounded-md transition-all duration-200 ${activeTab === "all" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
            >
              Tất cả ({courses.length})
            </button>
            <button
              onClick={() => setActiveTab("in-progress")}
              className={`flex-1 md:w-32 py-2 px-4 text-sm font-bold rounded-md transition-all duration-200 ${activeTab === "in-progress" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
            >
              Đang học
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`flex-1 md:w-32 py-2 px-4 text-sm font-bold rounded-md transition-all duration-200 ${activeTab === "completed" ? "bg-white text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
            >
              Đã hoàn thành
            </button>
          </div>

          {/* Search */}
          <div className="w-full md:w-80 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* COURSE GRID */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-300 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
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
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Không tìm thấy khóa học
            </h3>
            <p className="text-gray-500 max-w-md">
              Không có khóa học nào khớp với tìm kiếm hoặc bộ lọc hiện tại của
              bạn.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                {/* Thumbnail / Header Khóa học */}
                <div
                  className={`h-36 bg-gradient-to-br ${course.thumbnail} relative p-4 flex flex-col justify-between overflow-hidden`}
                >
                  {/* Lớp phủ mờ (Overlay) */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>

                  <div className="relative z-10 flex justify-between items-start">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                      {course.category}
                    </span>
                    {course.status === "completed" && (
                      <div className="bg-green-500 text-white rounded-full p-1 shadow-md">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Nút Play (Chỉ hiện khi hover) */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 ml-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Nội dung chi tiết */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3
                    className="font-bold text-gray-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors line-clamp-2"
                    title={course.title}
                  >
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    GV: {course.instructor}
                  </p>

                  {/* Thanh tiến trình */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-xs font-bold text-gray-700">
                        {course.progress}% hoàn thành
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {course.completedLessons}/{course.totalLessons} bài
                      </span>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden mb-3">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${course.status === "completed" ? "bg-green-500" : "bg-[#1a2b4c]"}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>

                    {/* Nút hành động */}
                    <button
                      className={`w-full py-2.5 rounded-lg text-sm font-bold transition-colors ${
                        course.status === "completed"
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : course.status === "not-started"
                            ? "bg-blue-50 text-blue-700 hover:bg-blue-100"
                            : "bg-[#1a2b4c] text-white hover:bg-opacity-90 shadow-sm"
                      }`}
                    >
                      {course.status === "completed"
                        ? "Xem lại khóa học"
                        : course.status === "not-started"
                          ? "Bắt đầu học"
                          : "Tiếp tục học"}
                    </button>
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

export default MyCourses;
