import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import analyticsApi from "../../../api/analyticsApi";
import courseApi from "../../../api/courseApi";

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

const statusLabel = (status) => {
  if (status === "ACTIVE" || status === "PUBLISHED") return { text: "Đang xuất bản", cls: "bg-emerald-100 text-emerald-700" };
  if (status === "ARCHIVED" || status === "INACTIVE") return { text: "Đã lưu trữ", cls: "bg-slate-100 text-slate-600" };
  if (status === "PENDING") return { text: "Chờ duyệt", cls: "bg-amber-100 text-amber-700" };
  return { text: "Bản nháp", cls: "bg-slate-100 text-slate-600" };
};

const InstructorDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [analyticsResponse, coursesResponse] = await Promise.all([
        analyticsApi.getOverview({ months: 12, top: 5, recent: 8 }).catch(() => null),
        courseApi.getCourses().catch(() => null),
      ]);

      setAnalytics(analyticsResponse?.data?.result || null);
      setCourses(coursesResponse?.data?.result || []);
    } catch (fetchError) {
      console.error("Failed to load instructor dashboard:", fetchError?.response?.data || fetchError);
      setError(fetchError?.response?.data?.message || "Không thể tải dữ liệu dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const summary = analytics?.summary || {};

  const stats = useMemo(() => [
    {
      label: "Khóa học của tôi",
      value: Number(summary.totalCourses || courses.length || 0).toLocaleString("vi-VN"),
      sub: `${summary.publishedCourses || courses.filter(c => c.status === "ACTIVE" || c.status === "PUBLISHED").length || 0} đang xuất bản`,
      color: "bg-indigo-50 text-indigo-600",
      iconPath: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
      label: "Tổng học viên",
      value: Number(summary.totalEnrollments || 0).toLocaleString("vi-VN"),
      sub: `${summary.totalLearners || 0} học viên duy nhất`,
      color: "bg-emerald-50 text-emerald-600",
      iconPath: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      label: "Doanh thu tháng này",
      value: formatCurrency(summary.thisMonthRevenue || 0),
      sub: `Tổng: ${formatCurrency(summary.totalRevenue || 0)}`,
      color: "bg-amber-50 text-amber-600",
      iconPath: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      label: "Khóa học chờ duyệt",
      value: Number(summary.pendingCourses || 0).toLocaleString("vi-VN"),
      sub: "Đang chờ admin phê duyệt",
      color: "bg-rose-50 text-rose-600",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
  ], [summary, courses]);

  const topCourses = analytics?.topCourses || [];
  const recentTransactions = analytics?.recentTransactions || [];

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
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-[22px] font-bold text-[#1a3a5c]">
            Dashboard Giảng viên
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi khóa học, học viên và doanh thu của bạn.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Làm mới
          </button>
          <button
            onClick={() => navigate("/instructor/courses")}
            className="bg-[#1a3a5c] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#15304f] transition-colors"
          >
            Quản lý khóa học
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div key={item.label} className="bg-white border border-slate-200 rounded-xl p-5 flex items-start gap-4">
            <div className={`w-11 h-11 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.iconPath} />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{item.label}</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{item.value}</p>
              <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* My Courses */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-800">Khóa học của tôi</h2>
            <button
              onClick={() => navigate("/instructor/courses")}
              className="text-xs text-blue-600 font-medium hover:text-blue-800"
            >
              Xem tất cả →
            </button>
          </div>
          <div className="p-5 space-y-3 max-h-80 overflow-y-auto">
            {courses.length === 0 ? (
              <p className="text-sm text-slate-500">Bạn chưa có khóa học nào.</p>
            ) : (
              courses.slice(0, 6).map((course) => {
                const status = statusLabel(course.status);
                return (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/instructor/courses/update/${course.id}`)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-800 truncate">{course.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">
                          {Number(course.totalStudents || 0)} học viên
                        </span>
                        {Number(course.avgRating || 0) > 0 && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-xs text-slate-400 flex items-center gap-0.5">
                              <svg className="w-3 h-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {Number(course.avgRating).toFixed(1)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${status.cls}`}>
                      {status.text}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Courses by Revenue */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800">Top khóa học theo doanh thu</h2>
          </div>
          <div className="p-5 space-y-4">
            {topCourses.length === 0 ? (
              <p className="text-sm text-slate-500">Chưa có dữ liệu doanh thu.</p>
            ) : (
              topCourses.map((course, index) => (
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

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Doanh thu gần đây</h3>
          <span className="text-xs text-slate-500">{recentTransactions.length} bản ghi</span>
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
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-sm text-slate-500 text-center">
                    Chưa có giao dịch nào.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => {
                  const statusCls =
                    tx.status === "SUCCESS" ? "bg-emerald-100 text-emerald-700"
                    : tx.status === "FAILED" ? "bg-red-100 text-red-700"
                    : tx.status === "PENDING" ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600";
                  return (
                    <tr key={tx.paymentId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-3 text-sm font-medium text-slate-900">
                        TXN-{tx.paymentId}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-700">{tx.studentName}</td>
                      <td className="px-6 py-3 text-sm text-slate-700">{tx.courseTitle}</td>
                      <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="px-6 py-3 text-sm text-slate-500">{formatDate(tx.paidAt)}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusCls}`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
