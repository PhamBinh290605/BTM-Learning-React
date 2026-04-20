import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Topbar from "../admin/layout/TopBar";
import Sidebar from "../admin/layout/SideBar";

const InstructorPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getActiveTab = (pathname) => {
    if (pathname.startsWith("/instructor/quiz")) return "quiz";

    const lastSegment = pathname.split("/").pop();
    return lastSegment === "instructor" || lastSegment === ""
      ? "dashboard"
      : lastSegment;
  };

  const active = getActiveTab(location.pathname);

  const handleNav = (path) => {
    navigate(`/instructor/${path}`);
  };

  const NAV_ITEMS = [
    {
      label: "Tổng quan",
      items: [{ id: "dashboard", icon: "grid", label: "Dashboard" }],
    },
    {
      label: "Giảng dạy",
      items: [
        { id: "courses", icon: "monitor", label: "Khóa học" },
        { id: "lessons", icon: "book", label: "Bài học" },
        { id: "quiz", icon: "zap", label: "Bài kiểm tra" },
      ],
    },
    {
      label: "Vận hành",
      items: [
        { id: "vouchers", icon: "tag", label: "Voucher" },
        { id: "notifications", icon: "bell", label: "Thông báo" },
        { id: "revenue", icon: "credit-card", label: "Doanh thu" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <Sidebar active={active} handleNav={handleNav} NAV_ITEMS={NAV_ITEMS} />
      <div className="ml-60 flex-1 flex flex-col">
        <Topbar roleLabel="Instructor" />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default InstructorPage;
