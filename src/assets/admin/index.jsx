import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Topbar from "./layout/TopBar";
import Sidebar from "./layout/sideBar";

const AdminPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  //   const currentPath = location.pathname.split("/").pop();

  //   const active = currentPath === "admin" ? "dashboard" : currentPath;

  const getActiveTab = (pathname) => {
    if (pathname.startsWith("/admin/quiz")) return "quiz";
    if (pathname.startsWith("/admin/user")) return "user"; // ví dụ
    if (pathname.startsWith("/admin/settings")) return "settings";

    // fallback
    const lastSegment = pathname.split("/").pop();
    return lastSegment === "admin" || lastSegment === ""
      ? "dashboard"
      : lastSegment;
  };

  const active = getActiveTab(location.pathname);

  const handleNav = (path) => {
    navigate(`/admin/${path}`);
  };

  const NAV_ITEMS = [
    {
      label: "Tổng quan",
      items: [
        {
          id: "dashboard",
          icon: "grid",
          label: "Dashboard",
        },
      ],
    },
    {
      label: "Học tập",
      items: [
        {
          id: "courses",
          icon: "monitor",
          label: "Khóa học",
        },
        {
          id: "lessons",
          icon: "book",
          label: "Bài học",
        },
        {
          id: "quiz",
          icon: "zap",
          label: "Bài kiểm tra",
        },
        {
          id: "chat-bot",
          icon: "message-square",
          label: "Chat Bot",
        },
        {
          id: "certificate",
          icon: "award",
          label: "Chứng chỉ",
        },
      ],
    },
    {
      label: "Quản lý",
      items: [
        {
          id: "student",
          icon: "user",
          label: "Học viên",
        },
        {
          id: "payment",
          icon: "credit-card",
          label: "Thanh toán",
        },
        {
          id: "notifications",
          icon: "bell",
          label: "Thông báo",
        },
        { id: "revenue", icon: "credit-card", label: "Doanh thu" },
        { id: "profile", icon: "user", label: "Hồ sơ" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar active={active} handleNav={handleNav} NAV_ITEMS={NAV_ITEMS} />
      <div className="ml-60 flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
