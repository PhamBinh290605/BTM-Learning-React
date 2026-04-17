import React, { useState } from "react";

const MyCertificates = () => {
  // --- 1. MOCK DATA: DANH SÁCH CHỨNG CHỈ ĐÃ ĐẠT ĐƯỢC ---
  const [certificates] = useState([
    {
      id: "CERT-2026-001",
      courseName: "Lập trình ReactJS & Next.js Thực chiến",
      instructor: "Nguyễn Thanh Tùng",
      issueDate: "15/04/2026",
      grade: "Xuất sắc",
      credentialUrl: "https://edubright.vn/cert/2026-001",
      theme: "from-blue-900 to-blue-700", // Màu nền theme của chứng chỉ
      accent: "text-blue-200",
    },
    {
      id: "CERT-2026-042",
      courseName: "Kiến trúc Hệ thống (System Design) Cơ bản",
      instructor: "Trần Minh Thu",
      issueDate: "02/03/2026",
      grade: "Giỏi",
      credentialUrl: "https://edubright.vn/cert/2026-042",
      theme: "from-gray-900 to-gray-700",
      accent: "text-gray-300",
    },
    {
      id: "CERT-2025-899",
      courseName: "Làm chủ Docker & CI/CD Pipeline",
      instructor: "Lê Hoàng Hải",
      issueDate: "20/11/2025",
      grade: "Giỏi",
      credentialUrl: "https://edubright.vn/cert/2025-899",
      theme: "from-indigo-900 to-purple-800",
      accent: "text-indigo-200",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("all");

  // Lọc chứng chỉ
  const filteredCerts = certificates.filter((cert) => {
    const matchSearch = cert.courseName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchYear =
      filterYear === "all" || cert.issueDate.includes(filterYear);
    return matchSearch && matchYear;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            Chứng chỉ của tôi
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý và chia sẻ những thành tựu bạn đã đạt được.
          </p>
        </div>
        <div>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Liên kết với LinkedIn
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-8">
        {/* TOOLBAR: TÌM KIẾM & LỌC */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 max-w-md relative">
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
              placeholder="Tìm kiếm chứng chỉ..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl outline-none focus:border-blue-500 shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select
              className="border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 bg-white text-sm text-gray-700 font-medium shadow-sm"
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
            >
              <option value="all">Tất cả thời gian</option>
              <option value="2026">Năm 2026</option>
              <option value="2025">Năm 2025</option>
            </select>
          </div>
        </div>

        {/* LƯỚI CHỨNG CHỈ (GRID) */}
        {filteredCerts.length === 0 ? (
          <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Chưa tìm thấy chứng chỉ nào
            </h3>
            <p className="text-gray-500 max-w-md">
              Bạn chưa có chứng chỉ nào phù hợp với bộ lọc hiện tại, hoặc chưa
              hoàn thành khóa học nào.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCerts.map((cert) => (
              <div
                key={cert.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* 1. Hình ảnh Preview Chứng chỉ (Graphic) */}
                <div
                  className={`aspect-[1.4] bg-gradient-to-br ${cert.theme} p-6 relative flex flex-col items-center justify-center text-center border-b-[8px] border-amber-400`}
                >
                  {/* Pattern mờ trang trí */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(#ffffff 1px, transparent 1px)",
                      backgroundSize: "16px 16px",
                    }}
                  ></div>

                  <div className="relative z-10 w-full h-full border border-white/20 p-4 flex flex-col justify-between">
                    <div
                      className={`text-xs font-bold uppercase tracking-widest ${cert.accent}`}
                    >
                      EduBright Certification
                    </div>

                    <div>
                      <h3 className="text-white font-serif text-xl font-bold leading-tight mb-2 line-clamp-2">
                        {cert.courseName}
                      </h3>
                      <p className="text-white/80 text-xs">
                        Được cấp cho sinh viên hoàn thành xuất sắc khóa học
                      </p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="text-left">
                        <div className="w-12 h-[1px] bg-white/40 mb-1"></div>
                        <p
                          className={`text-[10px] uppercase font-bold ${cert.accent}`}
                        >
                          Giảng viên
                        </p>
                        <p className="text-white text-xs">{cert.instructor}</p>
                      </div>

                      {/* Logo Huy hiệu */}
                      <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-yellow-900"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Thông tin chi tiết bên dưới thẻ */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-1">
                        Cấp ngày: {cert.issueDate}
                      </p>
                      <p className="text-sm font-bold text-gray-900">
                        ID: {cert.id}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md border border-green-100">
                      {cert.grade}
                    </span>
                  </div>

                  {/* 3. Nút Hành động */}
                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button className="flex-1 bg-[#1a2b4c] text-white py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-colors flex justify-center items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Tải PDF
                    </button>

                    <button
                      className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors tooltip-trigger relative"
                      title="Copy Link"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </button>

                    <button
                      className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors tooltip-trigger relative"
                      title="Chia sẻ lên LinkedIn"
                    >
                      {/* Icon LinkedIn đơn giản */}
                      <svg
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="h-4 w-4"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
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

export default MyCertificates;
