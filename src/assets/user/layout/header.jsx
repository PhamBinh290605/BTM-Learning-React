import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutApi } from "../../../api/auth";
import userApi from "../../../api/userApi";
import notificationApi from "../../../api/notificationApi";
import { useTheme } from "../../../utils/ThemeContext";
import {
  clearSession,
  getAccessToken,
  getDefaultRouteByRole,
  getStoredFullName,
  getStoredRole,
} from "../../../utils/session";
import { resolveMediaUrl } from "../../../utils/media";

const Header = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);

  const navLinks = [
    { label: "Trang chủ", path: "/" },
    { label: "Khóa học", path: "/courses" },
    { label: "Về chúng tôi", path: "/about" },
  ];

  const isLoggedIn = !!getAccessToken();
  const dashboardPath = getDefaultRouteByRole(getStoredRole());

  useEffect(() => {
    let isMounted = true;

    const loadMyProfile = async () => {
      if (!isLoggedIn) {
        setProfile(null);
        return;
      }

      try {
        const response = await userApi.getMyProfile();
        if (!isMounted) return;
        setProfile(response?.data?.result || null);
      } catch {
        if (!isMounted) return;
        setProfile(null);
      }
    };

    loadMyProfile();

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  // Fetch unread notification count
  useEffect(() => {
    let isMounted = true;

    const loadUnreadCount = async () => {
      if (!isLoggedIn) {
        setUnreadCount(0);
        return;
      }

      try {
        const response = await notificationApi.getUnreadCount();
        if (!isMounted) return;
        const count = Number(response?.data?.result);
        setUnreadCount(Number.isFinite(count) ? count : 0);
      } catch {
        if (!isMounted) return;
        setUnreadCount(0);
      }
    };

    loadUnreadCount();

    // Poll every 30 seconds
    const intervalId = isLoggedIn
      ? window.setInterval(loadUnreadCount, 30000)
      : undefined;

    return () => {
      isMounted = false;
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!userMenuOpen && !notifOpen) return;

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen, notifOpen]);

  const handleOpenNotifications = async () => {
    const willOpen = !notifOpen;
    setNotifOpen(willOpen);
    setUserMenuOpen(false);

    if (willOpen) {
      try {
        const response = await notificationApi.getMyNotifications();
        const list = Array.isArray(response?.data?.result)
          ? response.data.result
          : [];
        setNotifications(list.slice(0, 10));
      } catch {
        setNotifications([]);
      }
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch {
      // silently fail
    }
  };

  const formatNotifTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const displayName = profile?.fullName || getStoredFullName() || "Người dùng";
  const avatarUrl = resolveMediaUrl(profile?.avatarUrl);
  const userInitials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore network errors, local session should still be cleared.
    }

    clearSession();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
            <span className="font-serif text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Edu<span className="text-amber-500">Bright</span>
            </span>
          </Link>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.path
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200"
              aria-label="Chuyển đổi giao diện"
            >
              {isDark ? (
                <svg
                  className="w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-[18px] h-[18px]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Notification Bell */}
            {isLoggedIn && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleOpenNotifications}
                  className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 relative"
                  aria-label="Thông báo"
                >
                  <svg
                    className="w-[18px] h-[18px]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold leading-none shadow-sm">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 max-h-96 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">Thông báo</p>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 text-[10px] font-bold">
                          {unreadCount} chưa đọc
                        </span>
                      )}
                    </div>
                    <div className="overflow-y-auto flex-1">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center">
                          <p className="text-sm text-slate-400 dark:text-slate-500">Không có thông báo</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => {
                              if (!notif.read) {
                                handleMarkAsRead(notif.id);
                              }
                            }}
                            className={`w-full text-left px-4 py-3 border-b border-slate-100 dark:border-white/[0.04] hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors ${
                              !notif.read ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {!notif.read && (
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm leading-snug ${
                                  !notif.read
                                    ? "font-semibold text-slate-900 dark:text-white"
                                    : "text-slate-600 dark:text-slate-300"
                                }`}>
                                  {notif.title || notif.message || "Thông báo mới"}
                                </p>
                                {notif.content && notif.content !== notif.title && (
                                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">
                                    {notif.content}
                                  </p>
                                )}
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                  {formatNotifTime(notif.createdAt)}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <div className="relative flex items-center gap-2" ref={userMenuRef}>
                <Link
                  to={dashboardPath}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                  Dashboard
                </Link>

                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                      userInitials
                    )}
                  </div>
                  <span className="hidden md:block max-w-32 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {displayName}
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 rounded-2xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900 shadow-2xl p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-200 dark:border-white/[0.08]">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{profile?.email || "Tài khoản học viên"}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="mt-2 w-full text-left rounded-xl px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                    >
                      Quản lý tài khoản
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left rounded-xl px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95"
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            >
              {mobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-white/[0.06] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === link.path
                    ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isLoggedIn ? (
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-white/[0.06] space-y-2">
                <div className="px-1 pb-1">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.04]">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={displayName} className="h-full w-full object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{displayName}</span>
                  </div>
                </div>

                <Link
                  to={dashboardPath}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
                >
                  Quản lý tài khoản
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-3 border-t border-slate-200 dark:border-white/[0.06] space-y-2">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold"
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
