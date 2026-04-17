import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TopNavBar = () => {
  const navItems = [
    { id: "home", label: "Trang chủ" },
    { id: "courses", label: "Khóa học" },
    { id: "certificates", label: "Chứng chỉ" },
    { id: "ai", label: "AI Trợ lý" },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  // State quản lý việc đóng/mở menu profile
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const currentPath = location.pathname.split("/").pop();
  const active =
    currentPath === "home" || currentPath === "" ? "home" : currentPath;

  const handleNav = (path) => {
    navigate(`/${path}`);
  };

  // Hàm xử lý khi click ra ngoài vùng menu thì tự động đóng lại
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Thêm logic xóa token/localStorage ở đây
    console.log("Đã đăng xuất!");
    setIsProfileMenuOpen(false);
    navigate("/");
  };

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo & Main Links */}
          <div className="flex items-center gap-8">
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

            {/* Menu điều hướng */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    active === item.id
                      ? "font-bold text-blue-700 bg-blue-50"
                      : "font-medium text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search, Notifications & Profile */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block w-64">
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
                placeholder="Tìm kiếm khóa học..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 bg-gray-50 rounded-full outline-none focus:border-blue-500 focus:bg-white text-sm transition-all"
              />
            </div>

            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className="absolute top-1 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* AVATAR & DROPDOWN MENU */}
            <div className="relative" ref={menuRef}>
              <div
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="w-9 h-9 rounded-full bg-[#1a2b4c] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer border-2 border-white ring-2 ring-gray-100 select-none"
              >
                U
              </div>

              {/* Submenu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-fade-in origin-top-right">
                  {/* Header của menu */}
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-bold text-gray-900">User Name</p>
                    <p className="text-xs text-gray-500 truncate">
                      user@example.com
                    </p>
                  </div>

                  {/* Link Xem thông tin */}
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors flex items-center gap-2"
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Thông tin tài khoản
                  </button>

                  {/* Nút Đăng xuất */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 mt-1"
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
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default TopNavBar;
