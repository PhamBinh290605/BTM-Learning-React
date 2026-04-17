import React, { useState } from "react";

const UserManagement = () => {
  // --- 1. MOCK DATA: DANH SÁCH NGƯỜI DÙNG ---
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Thanh Tùng",
      email: "thanhtung@gmail.com",
      role: "student",
      status: "active",
      enrolledCourses: 4,
      joinDate: "10/04/2026",
      avatarColor: "bg-blue-500",
    },
    {
      id: 2,
      name: "Trần Minh Thu",
      email: "minhthu.edu@gmail.com",
      role: "instructor",
      status: "active",
      enrolledCourses: 12,
      joinDate: "15/01/2026",
      avatarColor: "bg-purple-500",
    },
    {
      id: 3,
      name: "Lê Hoàng Hải",
      email: "admin.hai@btmlearning.vn",
      role: "admin",
      status: "active",
      enrolledCourses: 0,
      joinDate: "01/12/2025",
      avatarColor: "bg-[#1a2b4c]",
    },
    {
      id: 4,
      name: "Phạm Tuấn Anh",
      email: "tuananh99@yahoo.com",
      role: "student",
      status: "banned",
      enrolledCourses: 1,
      joinDate: "16/04/2026",
      avatarColor: "bg-red-500",
    },
    {
      id: 5,
      name: "Đoàn Thị Mai",
      email: "mai.doan@gmail.com",
      role: "student",
      status: "pending",
      enrolledCourses: 0,
      joinDate: "17/04/2026",
      avatarColor: "bg-green-500",
    },
  ]);

  // --- 2. STATE: BỘ LỌC VÀ TÌM KIẾM ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // --- 3. HÀM XỬ LÝ LỌC DỮ LIỆU ---
  const filteredUsers = users.filter((user) => {
    const matchSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === "all" || user.role === filterRole;
    const matchStatus = filterStatus === "all" || user.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  // --- 4. CÁC HÀM TIỆN ÍCH HIỂN THỊ ---

  // Lấy chữ cái đầu làm Avatar
  const getInitials = (name) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Render Label Vai trò
  const renderRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-gray-800 text-white">
            Quản trị viên
          </span>
        );
      case "instructor":
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-purple-100 text-purple-700">
            Giảng viên
          </span>
        );
      case "student":
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded bg-blue-50 text-blue-600">
            Học viên
          </span>
        );
      default:
        return null;
    }
  };

  // Render Label Trạng thái
  const renderStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium text-gray-700">Hoạt động</span>
          </div>
        );
      case "banned":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span className="text-sm font-medium text-red-600">Bị khóa</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className="text-sm font-medium text-yellow-600">
              Chờ duyệt
            </span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            Quản lý Người dùng
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Phân quyền, theo dõi hoạt động và quản lý tài khoản.
          </p>
        </div>
        <div>
          <button className="bg-[#1a2b4c] hover:bg-opacity-90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
            Thêm người dùng mới
          </button>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-6">
        {/* THỐNG KÊ NHANH */}
        <div className="grid grid-cols-4 gap-6">
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Tổng người dùng
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {users.length}
              </h3>
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Học viên</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "student").length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
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
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Giảng viên</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.role === "instructor").length}
              </h3>
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
                Tài khoản bị khóa
              </p>
              <h3 className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.status === "banned").length}
              </h3>
            </div>
          </div>
        </div>

        {/* TOOLBAR: SEARCH & FILTER */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center gap-4">
          {/* Ô Tìm kiếm */}
          <div className="flex-1 relative">
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
              placeholder="Tìm kiếm theo Tên hoặc Email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Bộ lọc */}
          <div className="flex gap-3">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 bg-white text-sm text-gray-700 font-medium cursor-pointer"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">Tất cả vai trò</option>
              <option value="student">Học viên</option>
              <option value="instructor">Giảng viên</option>
              <option value="admin">Quản trị viên</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 bg-white text-sm text-gray-700 font-medium cursor-pointer"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="pending">Chờ duyệt</option>
              <option value="banned">Bị khóa</option>
            </select>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU (DATA TABLE) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4 text-center">Khóa học</th>
                  <th className="px-6 py-4">Ngày tham gia</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      Không tìm thấy người dùng nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Cột 1: Thông tin User (Avatar + Name + Email) */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar tự tạo từ chữ cái đầu */}
                          <div
                            className={`w-10 h-10 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-bold shadow-sm shrink-0`}
                          >
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm hover:text-blue-600 cursor-pointer transition-colors">
                              {user.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Cột 2: Vai trò */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderRoleBadge(user.role)}
                      </td>

                      {/* Cột 3: Khóa học đã tham gia / Đang dạy */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="text-sm font-bold text-gray-700">
                          {user.enrolledCourses}
                        </span>
                      </td>

                      {/* Cột 4: Ngày tham gia */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {user.joinDate}
                        </span>
                      </td>

                      {/* Cột 5: Trạng thái */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(user.status)}
                      </td>

                      {/* Cột 6: Thao tác (Hành động) */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Chỉnh sửa thông tin"
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
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>

                          {/* Nút Khóa / Mở Khóa */}
                          {user.status === "banned" ? (
                            <button
                              className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Mở khóa tài khoản"
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
                                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                          ) : (
                            <button
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded transition-colors"
                              title="Khóa tài khoản"
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
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            </button>
                          )}

                          <button
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa người dùng"
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination (Phân trang giả lập) */}
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Đang hiển thị{" "}
              <span className="font-bold text-gray-900">
                {filteredUsers.length}
              </span>{" "}
              người dùng
            </span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-400 cursor-not-allowed">
                Trước
              </button>
              <button className="px-3 py-1 border border-blue-500 bg-blue-50 text-blue-600 font-bold rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border border-gray-300 hover:bg-gray-50 rounded text-sm text-gray-600 font-medium">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
