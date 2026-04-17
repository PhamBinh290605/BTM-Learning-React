import { useState } from "react";
import LeftPanel from "./components/LeftPanel";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy thông tin URL hiện tại

  const listTabs = [
    { title: "Đăng nhập", path: "/auth/login" },
    { title: "Đăng ký", path: "/auth/register" },
  ];

  // Lấy path hiện tại từ location để so sánh
  const currentPath = location.pathname;

  const handleSetTab = (path) => {
    setTab(path);
    navigate(path);
  };

  const stats = [
    { num: "12K+", label: "Khóa học" },
    { num: "98%", label: "Hài lòng" },
    { num: "500K", label: "Học viên" },
  ];

  const courses = [
    {
      icon: "💻",
      name: "Web Development",
      meta: "48 bài · 12 giờ",
      progress: 72,
    },
    { icon: "🎨", name: "UI/UX Design", meta: "36 bài · 8 giờ", progress: 45 },
    { icon: "📊", name: "Data Science", meta: "60 bài · 20 giờ", progress: 30 },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-[#0a0f1e]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 10% 20%, rgba(99,102,241,0.15) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(56,189,248,0.1) 0%, transparent 60%)",
      }}
    >
      <div className="w-full max-w-4xl grid lg:grid-cols-2 min-h-[620px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
        <LeftPanel courses={courses} stats={stats} />

        <div className="bg-[#111827] flex flex-col p-8 lg:p-10">
          <div className="flex bg-white/5 rounded-xl p-1 gap-1 mb-7">
            {listTabs.map((t) => (
              <button
                key={t.path}
                onClick={() => navigate(t.path)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  currentPath === t.path
                    ? "bg-white/[0.1] text-white border border-white/[0.12]"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
