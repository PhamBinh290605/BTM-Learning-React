import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { logoutApi } from "../../../api/auth";
import { clearSession, getStoredFullName } from "../../../utils/session";

// ─── TOPBAR ───
const Topbar = ({ roleLabel = "Admin" }) => {
  const fullName = getStoredFullName() || "Người dùng";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = location.pathname.startsWith("/instructor")
    ? "/instructor"
    : "/admin";

  // Close menu on click outside
  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors, local session should still be cleared.
    }

    clearSession();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className="h-15 bg-white border-b border-slate-200 flex items-center px-7 gap-4 sticky top-0 z-40"
      style={{ height: 60 }}
    >
      <div className="flex-1 max-w-sm relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M11 11l3 3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="text"
          placeholder="Tìm khóa học, bài học..."
          className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm bg-slate-50 outline-none focus:border-[#1a3a5c] transition-colors"
        />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <button className="w-9 h-9 border border-slate-200 rounded-lg flex items-center justify-center relative hover:bg-slate-50 transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 2a4 4 0 00-4 4v3l-1.5 2h11L12 9V6a4 4 0 00-4-4z"
              stroke="#6b7a90"
              strokeWidth="1.5"
            />
            <path
              d="M6.5 13.5a1.5 1.5 0 003 0"
              stroke="#6b7a90"
              strokeWidth="1.5"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
        </button>

        {/* User Menu with Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-800">
              {initials || "U"}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-slate-800 leading-none">
                {fullName}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">{roleLabel}</div>
            </div>
            <svg
              className={`w-4 h-4 text-slate-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-14 w-56 rounded-xl border border-slate-200 bg-white shadow-2xl p-1.5 z-50 animate-in fade-in">
              <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{fullName}</p>
                <p className="text-xs text-slate-400 mt-0.5">{roleLabel}</p>
              </div>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  navigate(`${basePath}/profile`);
                }}
                className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-2.5"
              >
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Quản lý tài khoản
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2.5"
              >
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
