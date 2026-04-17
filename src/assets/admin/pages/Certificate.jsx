import React, { useState } from "react";

const CertificateManagement = () => {
  // --- 1. STATE QUẢN LÝ TAB ---
  const [activeTab, setActiveTab] = useState("issued"); // 'issued' (Đã cấp), 'templates' (Mẫu chứng chỉ)

  // --- 2. MOCK DATA: DANH SÁCH MẪU CHỨNG CHỈ ---
  const [templates] = useState([
    {
      id: 1,
      name: "Mẫu Tiêu chuẩn (Xanh dương)",
      theme: "from-blue-900 to-blue-800",
      accent: "text-blue-200",
      border: "border-blue-400",
      uses: 1250,
      isActive: true,
    },
    {
      id: 2,
      name: "Mẫu Cao cấp (Đen mờ & Vàng)",
      theme: "from-gray-900 to-gray-800",
      accent: "text-amber-400",
      border: "border-amber-400",
      uses: 840,
      isActive: true,
    },
    {
      id: 3,
      name: "Mẫu Tối giản (Trắng & Xanh)",
      theme: "from-white to-gray-50",
      accent: "text-blue-600",
      border: "border-blue-600",
      uses: 420,
      isActive: true,
    },
  ]);

  // --- 3. MOCK DATA: LỊCH SỬ CẤP PHÁT ---
  const [issuedCerts, setIssuedCerts] = useState([
    {
      id: "CERT-2026-1042",
      student: "Nguyễn Thanh Tùng",
      email: "tung@gmail.com",
      course: "Lập trình ReactJS & Next.js Thực chiến",
      date: "17/04/2026",
      status: "valid",
    },
    {
      id: "CERT-2026-1041",
      student: "Trần Minh Thu",
      email: "thu.tm@gmail.com",
      course: "Thiết kế UI/UX với Figma",
      date: "15/04/2026",
      status: "valid",
    },
    {
      id: "CERT-2026-0998",
      student: "Phạm Tuấn Anh",
      email: "anh.pt@yahoo.com",
      course: "Docker & CI/CD Pipeline",
      date: "10/04/2026",
      status: "revoked",
    },
    {
      id: "CERT-2026-0950",
      student: "Đoàn Thị Mai",
      email: "mai.doan@gmail.com",
      course: "Tiếng Anh giao tiếp cho IT",
      date: "01/04/2026",
      status: "valid",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Lọc lịch sử cấp phát
  const filteredCerts = issuedCerts.filter(
    (cert) =>
      cert.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.course.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Hàm thu hồi chứng chỉ
  const handleRevoke = (id) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn thu hồi chứng chỉ ID: ${id} không? Hành động này sẽ làm link xác minh bị vô hiệu hóa.`,
      )
    ) {
      setIssuedCerts(
        issuedCerts.map((cert) =>
          cert.id === id ? { ...cert, status: "revoked" } : cert,
        ),
      );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            Quản lý Chứng chỉ
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Thiết kế mẫu, theo dõi cấp phát và quản lý tính hợp lệ của chứng
            chỉ.
          </p>
        </div>
        <div>
          <button className="bg-[#1a2b4c] hover:bg-opacity-90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Tạo mẫu chứng chỉ mới
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-6">
        {/* THỐNG KÊ NHANH */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Tổng chứng chỉ đã cấp
              </p>
              <h3 className="text-2xl font-bold text-gray-900">2,510</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Mẫu đang hoạt động
              </p>
              <h3 className="text-2xl font-bold text-gray-900">3</h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center shrink-0">
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
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Đã thu hồi (Revoked)
              </p>
              <h3 className="text-2xl font-bold text-gray-900">12</h3>
            </div>
          </div>
        </div>

        {/* TABS ĐIỀU HƯỚNG */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("issued")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "issued" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Lịch sử cấp phát
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === "templates" ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            Mẫu thiết kế (Templates)
          </button>
        </div>

        {/* --- NỘI DUNG TAB: LỊCH SỬ CẤP PHÁT --- */}
        {activeTab === "issued" && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-fade-in">
            {/* Toolbar */}
            <div className="p-4 border-b border-gray-100 flex gap-4 bg-gray-50/50">
              <div className="flex-1 relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
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
                  placeholder="Tìm theo Mã ID, Học viên hoặc Khóa học..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Bảng Dữ liệu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Mã Chứng chỉ</th>
                    <th className="px-6 py-4">Học viên</th>
                    <th className="px-6 py-4">Khóa học</th>
                    <th className="px-6 py-4">Ngày cấp</th>
                    <th className="px-6 py-4">Trạng thái</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCerts.map((cert) => (
                    <tr
                      key={cert.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-bold text-gray-700">
                        {cert.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-bold text-gray-900 text-sm">
                          {cert.student}
                        </p>
                        <p className="text-xs text-gray-500">{cert.email}</p>
                      </td>
                      <td
                        className="px-6 py-4 text-sm text-gray-700 max-w-[250px] truncate"
                        title={cert.course}
                      >
                        {cert.course}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {cert.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cert.status === "valid" ? (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-green-50 text-green-700 border border-green-200">
                            Hợp lệ
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-50 text-red-700 border border-red-200">
                            Đã thu hồi
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-blue-600 hover:text-blue-800 transition-colors tooltip-trigger"
                            title="Xem chứng chỉ"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          {cert.status === "valid" && (
                            <button
                              onClick={() => handleRevoke(cert.id)}
                              className="text-gray-400 hover:text-red-600 transition-colors tooltip-trigger"
                              title="Thu hồi chứng chỉ"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- NỘI DUNG TAB: MẪU CHỨNG CHỈ (TEMPLATES) --- */}
        {activeTab === "templates" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group"
              >
                {/* Visual Preview của Mẫu */}
                <div
                  className={`aspect-[1.4] bg-gradient-to-br ${tpl.theme} p-6 relative flex flex-col items-center justify-center text-center border-b-[8px] ${tpl.border}`}
                >
                  {/* Pattern mờ */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')]"></div>

                  <div className="relative z-10 w-full h-full border border-white/20 p-4 flex flex-col justify-between">
                    <div
                      className={`text-[10px] font-bold uppercase tracking-widest ${tpl.accent} ${tpl.id === 3 ? "text-gray-500" : ""}`}
                    >
                      EduBright Certification
                    </div>

                    <div>
                      <h3
                        className={`font-serif text-lg font-bold leading-tight mb-2 ${tpl.id === 3 ? "text-gray-900" : "text-white"}`}
                      >
                        [Tên Khóa Học]
                      </h3>
                      <p
                        className={`text-xs ${tpl.id === 3 ? "text-gray-500" : "text-white/80"}`}
                      >
                        Trao tặng cho: [Tên Học Viên]
                      </p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="text-left">
                        <div
                          className={`w-12 h-[1px] mb-1 ${tpl.id === 3 ? "bg-gray-300" : "bg-white/40"}`}
                        ></div>
                        <p
                          className={`text-[8px] uppercase font-bold ${tpl.accent} ${tpl.id === 3 ? "text-gray-400" : ""}`}
                        >
                          Chữ ký Giảng viên
                        </p>
                      </div>

                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${tpl.id === 3 ? "bg-blue-100 text-blue-600" : "bg-amber-400 text-yellow-900"}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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

                {/* Thông tin và Actions của Mẫu */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900">{tpl.name}</h3>
                    {tpl.isActive && (
                      <span
                        className="w-2 h-2 rounded-full bg-green-500 mt-1.5"
                        title="Đang được sử dụng"
                      ></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    Đã dùng cho {tpl.uses.toLocaleString()} chứng chỉ
                  </p>

                  <div className="flex gap-2">
                    <button className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors">
                      Chỉnh sửa
                    </button>
                    <button
                      className="px-3 py-2 border border-gray-300 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa mẫu"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Thẻ Thêm Mới Trống */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center p-8 text-center text-gray-500 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 cursor-pointer transition-all min-h-[300px]">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 border border-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-1">Tạo mẫu mới</h3>
              <p className="text-sm px-4">
                Sử dụng công cụ kéo thả để thiết kế mẫu chứng chỉ mang thương
                hiệu riêng của bạn.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateManagement;
