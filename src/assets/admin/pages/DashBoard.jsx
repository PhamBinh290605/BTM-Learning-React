import { useState } from "react";
import StatCard from "../components/StatCard";
import PendingCoursesCard from "../components/PendingCoursesCard";
import SprintCard from "../components/SprintCard";
import TaskTable from "../components/TaskTable";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  // ─── DATA ───
  const STATS = [
    {
      label: "Tổng người dùng",
      value: "50,248",
      change: "↑ 12% so với tháng trước",
      up: true,
      iconBg: "bg-indigo-100",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <circle cx="6" cy="5" r="3" stroke="#3730a3" strokeWidth="1.5" />
          <path
            d="M1 14c0-2.8 2.2-5 5-5h4a5 5 0 015 5"
            stroke="#3730a3"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Khóa học đang hoạt động",
      value: "1,204",
      change: "↑ 8% so với tháng trước",
      up: true,
      iconBg: "bg-green-100",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <rect
            x="1"
            y="2"
            width="14"
            height="10"
            rx="2"
            stroke="#15803d"
            strokeWidth="1.5"
          />
          <path
            d="M5 15h6M8 12v3"
            stroke="#15803d"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      label: "Tổng đăng ký",
      value: "184,390",
      change: "↑ 22% so với tháng trước",
      up: true,
      iconBg: "bg-yellow-100",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path
            d="M2 4l6-3 6 3v5c0 3-6 5-6 5S2 12 2 9V4z"
            stroke="#92400e"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      label: "Doanh thu tháng này",
      value: "₫482M",
      change: "↓ 3% so với tháng trước",
      up: false,
      iconBg: "bg-pink-100",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <rect
            x="1"
            y="4"
            width="14"
            height="9"
            rx="2"
            stroke="#9d174d"
            strokeWidth="1.5"
          />
          <path d="M1 7h14" stroke="#9d174d" strokeWidth="1.5" />
        </svg>
      ),
    },
  ];

  const PENDING_COURSES = [
    {
      name: "React & Next.js Fullstack",
      sub: "Lập trình · 42 giờ",
      instructor: "Minh Hoàng",
      date: "10/04/2025",
    },
    {
      name: "Machine Learning Python",
      sub: "AI & Data · 60 giờ",
      instructor: "Thanh Hà",
      date: "09/04/2025",
    },
    {
      name: "Digital Marketing 2025",
      sub: "Kinh doanh · 28 giờ",
      instructor: "Quang Đức",
      date: "08/04/2025",
    },
  ];

  const SPRINT_TASKS = [
    {
      id: "T-01",
      name: "Project Setup",
      status: "Done",
      progress: 100,
      badgeClass: "bg-green-100 text-green-700",
      barColor: "bg-green-500",
    },
    {
      id: "T-02",
      name: "JWT Auth",
      status: "Done",
      progress: 100,
      badgeClass: "bg-green-100 text-green-700",
      barColor: "bg-green-500",
    },
    {
      id: "T-12",
      name: "VNPay Payment",
      status: "In Progress",
      progress: 70,
      badgeClass: "bg-indigo-100 text-indigo-700",
      barColor: "bg-amber-400",
    },
    {
      id: "T-17",
      name: "AI Quiz Generator",
      status: "Pending",
      progress: 20,
      badgeClass: "bg-yellow-100 text-yellow-800",
      barColor: "bg-amber-400",
    },
    {
      id: "T-23",
      name: "AI Chatbot",
      status: "Not started",
      progress: 0,
      badgeClass: "bg-slate-100 text-slate-500",
      barColor: "bg-amber-400",
    },
  ];

  const ALL_TASKS = [
    [
      "T-01",
      "Project Setup & Infrastructure",
      "High",
      "Dev 1",
      "Ngày 1-2",
      "—",
      "Done",
    ],
    ["T-02", "JWT Authentication", "High", "Dev 1", "Ngày 3-5", "T-01", "Done"],
    [
      "T-03",
      "OAuth2 Google Login",
      "High",
      "Dev 1",
      "Ngày 5-6",
      "T-02",
      "Done",
    ],
    [
      "T-04",
      "User Profile Management",
      "Medium",
      "Dev 1",
      "Ngày 6-7",
      "T-02",
      "Done",
    ],
    ["T-05", "Category CRUD", "Medium", "Dev 3", "Ngày 3", "T-01", "Done"],
    [
      "T-06",
      "Course CRUD & Lifecycle",
      "High",
      "Dev 1",
      "Ngày 6-9",
      "T-02, T-05",
      "In Progress",
    ],
    [
      "T-07",
      "Course Thumbnail Upload",
      "Medium",
      "Dev 3",
      "Ngày 7",
      "T-06",
      "Done",
    ],
    ["T-08", "Section Management", "Medium", "Dev 2", "Ngày 5", "T-06", "Done"],
    [
      "T-09",
      "Lesson Management",
      "High",
      "Dev 2",
      "Ngày 6-8",
      "T-08",
      "In Progress",
    ],
    [
      "T-10",
      "Video Upload to Cloudinary",
      "High",
      "Dev 2",
      "Ngày 8-9",
      "T-09",
      "In Progress",
    ],
    [
      "T-11",
      "Lesson Progress Tracking",
      "High",
      "Dev 2",
      "Ngày 11-12",
      "T-09, T-14",
      "Pending",
    ],
    [
      "T-12",
      "Payment — VNPay",
      "High",
      "Dev 1",
      "Ngày 10-13",
      "T-02",
      "In Progress",
    ],
    [
      "T-13",
      "Payment — Stripe",
      "Medium",
      "Dev 1",
      "Ngày 13-15",
      "T-12",
      "Pending",
    ],
    [
      "T-14",
      "Enrollment Management",
      "High",
      "Dev 2",
      "Ngày 10-11",
      "T-12",
      "Pending",
    ],
    ["T-15", "Quiz CRUD", "High", "Dev 2", "Ngày 12-13", "T-06", "Pending"],
    [
      "T-16",
      "Question & Answer CRUD",
      "High",
      "Dev 2",
      "Ngày 13-14",
      "T-15",
      "Pending",
    ],
    [
      "T-17",
      "AI Quiz Generator",
      "High",
      "Dev 2",
      "Ngày 15-17",
      "T-15, T-16",
      "Pending",
    ],
    [
      "T-18",
      "Quiz Attempt & Auto Grading",
      "High",
      "Dev 2",
      "Ngày 14-16",
      "T-15, T-16",
      "Pending",
    ],
    [
      "T-19",
      "AI Essay Grading",
      "Medium",
      "Dev 2",
      "Ngày 16-17",
      "T-18",
      "Not started",
    ],
    [
      "T-20",
      "Certificate Auto-Issue",
      "Medium",
      "Dev 3",
      "Ngày 14-15",
      "T-11, T-18",
      "Not started",
    ],
    [
      "T-21",
      "Certificate Verification",
      "Low",
      "Dev 3",
      "Ngày 15",
      "T-20",
      "Not started",
    ],
    [
      "T-22",
      "Course Reviews",
      "Medium",
      "Dev 3",
      "Ngày 12-13",
      "T-14",
      "Not started",
    ],
    [
      "T-23",
      "AI Chatbot",
      "High",
      "Dev 1",
      "Ngày 14-17",
      "T-02",
      "Not started",
    ],
    [
      "T-24",
      "AI Course Recommendation",
      "Medium",
      "Dev 1",
      "Ngày 17-18",
      "T-14, T-23",
      "Not started",
    ],
    [
      "T-25",
      "Notification System",
      "Medium",
      "Dev 3",
      "Ngày 16-17",
      "T-12, T-14, T-20",
      "Not started",
    ],
    [
      "T-26",
      "Admin — User Management",
      "High",
      "Dev 1",
      "Ngày 16-17",
      "T-02",
      "Not started",
    ],
    [
      "T-27",
      "Admin — Course Approval",
      "High",
      "Dev 1",
      "Ngày 17-18",
      "T-06",
      "Not started",
    ],
    [
      "T-28",
      "Admin Dashboard Stats",
      "Medium",
      "Dev 3",
      "Ngày 18",
      "All entities",
      "Not started",
    ],
    [
      "T-29",
      "Rate Limiting & Security",
      "High",
      "Dev 2",
      "Ngày 17-18",
      "All endpoints",
      "Not started",
    ],
    [
      "T-30",
      "Testing & API Documentation",
      "High",
      "Dev 3",
      "Ngày 17-20",
      "All",
      "Not started",
    ],
  ];

  const [pendingCourses, setPendingCourses] = useState(PENDING_COURSES);
  const navigate = useNavigate();

  const handleApprove = (i) =>
    setPendingCourses((prev) => prev.filter((_, idx) => idx !== i));
  const handleReject = (i) =>
    setPendingCourses((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="p-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-[22px] font-bold text-[#1a3a5c]">
            Dashboard tổng quan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Chào buổi sáng, Bình Phạm! Hôm nay bạn học gì?
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/courses")}
          className="flex items-center gap-1.5 bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#15304f] transition-colors"
        >
          + Thêm khóa học
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Two-col: pending + sprint */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PendingCoursesCard
          courses={pendingCourses}
          onApprove={handleApprove}
          onReject={handleReject}
        />
        <SprintCard tasks={SPRINT_TASKS} />
      </div>

      {/* Full task table */}
      <TaskTable tasks={ALL_TASKS} />
    </div>
  );
};

export default DashboardPage;
