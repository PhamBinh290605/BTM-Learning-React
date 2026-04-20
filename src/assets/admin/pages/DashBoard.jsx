import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import analyticsApi from "../../../api/analyticsApi";
import courseApi from "../../../api/courseApi";
import { getStoredRole } from "../../../utils/session";
import PendingCoursesCard from "../components/PendingCoursesCard";
import StatCard from "../components/StatCard";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDate = (value) => {
  if (!value) return "--";
  return new Date(value).toLocaleDateString("vi-VN");
};

const statusBadge = (status) => {
  if (status === "SUCCESS") return "bg-emerald-100 text-emerald-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  if (status === "PENDING") return "bg-amber-100 text-amber-700";
  if (status === "REFUNDED") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
};

const DashboardPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith("/instructor")
    ? "/instructor"
    : "/admin";

  const role = getStoredRole();
  const isAdmin = role === "ADMIN";

  const fetchOverview = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await analyticsApi.getOverview({ months: 12, top: 5, recent: 8 });
      setAnalytics(response?.data?.result || null);
    } catch (fetchError) {
      console.error("Failed to load dashboard overview:", fetchError?.response?.data || fetchError);
      setError(fetchError?.response?.data?.message || "Không thể tải dữ liệu dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const stats = useMemo(() => {
    const summary = analytics?.summary || {};

    return [
      {
        label: "Tổng khóa học",
        value: Number(summary.totalCourses || 0).toLocaleString("vi-VN"),
        change: `${summary.pendingCourses || 0} đang chờ duyệt`,
        up: true,
        iconBg: "bg-indigo-100",
        icon: (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="2" width="12" height="10" rx="2" stroke="#3730a3" strokeWidth="1.5" />
            <path d="M5 14h6" stroke="#3730a3" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
      {
        label: "Đang xuất bản",
        value: Number(summary.publishedCourses || 0).toLocaleString("vi-VN"),
        change: "Khóa học đang hoạt động",
        up: true,
        iconBg: "bg-green-100",
        icon: (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="#15803d" strokeWidth="1.5" />
            <path d="M5 8l2 2 4-4" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
      },
      {
        label: "Tổng đăng ký",
        value: Number(summary.totalEnrollments || 0).toLocaleString("vi-VN"),
        change: `${summary.totalLearners || 0} học viên duy nhất`,
        up: true,
        iconBg: "bg-yellow-100",
        icon: (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12v8H2z" stroke="#92400e" strokeWidth="1.5" />
            <path d="M2 7h12" stroke="#92400e" strokeWidth="1.5" />
          </svg>
        ),
      },
      {
        label: "Doanh thu tháng này",
        value: formatCurrency(summary.thisMonthRevenue || 0),
        change: `Tổng doanh thu: ${formatCurrency(summary.totalRevenue || 0)}`,
        up: Number(summary.thisMonthRevenue || 0) >= 0,
        iconBg: "bg-pink-100",
        icon: (
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path d="M3 11l3-3 2 2 5-5" stroke="#9d174d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M3 13h10" stroke="#9d174d" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ),
      },
    ];
  }, [analytics]);

  const pendingCourses = (analytics?.pendingCourses || []).map((course) => ({
    id: course.courseId,
    name: course.title,
    sub: course.categoryName || "Chưa phân loại",
    instructor: course.instructorName || "Không rõ",
    date: formatDate(course.submittedAt),
  }));

  const handleApprove = async (courseId) => {
    try {
      await courseApi.approveCourse(courseId);
      await fetchOverview();
    } catch (approveError) {
      console.error("Approve course failed:", approveError?.response?.data || approveError);
      alert(approveError?.response?.data?.message || "Duyệt khóa học thất bại");
    }
  };

  const handleReject = async (courseId) => {
    const accepted = window.confirm("Bạn có chắc muốn từ chối khóa học này không?");
    if (!accepted) return;

    try {
      await courseApi.rejectCourse(courseId);
      await fetchOverview();
    } catch (rejectError) {
      console.error("Reject course failed:", rejectError?.response?.data || rejectError);
      alert(rejectError?.response?.data?.message || "Từ chối khóa học thất bại");
    }
  };

  if (isLoading) {
    return (
      <div className="p-7">
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600">
          Đang tải dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-7">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-7 flex flex-col gap-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-[22px] font-bold text-[#1a3a5c]">
            Dashboard tổng quan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi dữ liệu đào tạo và vận hành theo thời gian thực.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchOverview}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Làm mới
          </button>
          <button
            onClick={() => navigate(`${basePath}/courses`)}
            className="bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#15304f] transition-colors"
          >
            Quản lý khóa học
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PendingCoursesCard
          courses={pendingCourses}
          onApprove={isAdmin ? handleApprove : undefined}
          onReject={isAdmin ? handleReject : undefined}
        />

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">Top khóa học theo doanh thu</h2>
          </div>
          <div className="p-5 space-y-4">
            {(analytics?.topCourses || []).length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có dữ liệu doanh thu.</p>
            ) : (
              (analytics?.topCourses || []).map((course, index) => (
                <div key={course.courseId} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-5 text-slate-400 font-semibold">#{index + 1}</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{course.courseTitle}</span>
                    </div>
                    <span className="font-bold text-slate-900">{formatCurrency(course.revenue)}</span>
                  </div>
                  <div className="text-xs text-slate-500 pl-7">
                    {Number(course.enrollments || 0).toLocaleString("vi-VN")} lượt đăng ký
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Giao dịch gần đây</h3>
          <span className="text-xs text-slate-500">{(analytics?.recentTransactions || []).length} bản ghi</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-6 py-3">Mã GD</th>
                <th className="px-6 py-3">Học viên</th>
                <th className="px-6 py-3">Khóa học</th>
                <th className="px-6 py-3">Số tiền</th>
                <th className="px-6 py-3">Ngày</th>
                <th className="px-6 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(analytics?.recentTransactions || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-sm text-slate-500 text-center">
                    Chưa có giao dịch nào.
                  </td>
                </tr>
              ) : (
                (analytics?.recentTransactions || []).map((transaction) => (
                  <tr key={transaction.paymentId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 text-sm font-medium text-slate-900">
                      TXN-{transaction.paymentId}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-700">{transaction.studentName}</td>
                    <td className="px-6 py-3 text-sm text-slate-700">{transaction.courseTitle}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-500">{formatDate(transaction.paidAt)}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusBadge(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
