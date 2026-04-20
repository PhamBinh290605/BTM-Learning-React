import { useEffect, useMemo, useState } from "react";
import analyticsApi from "../../../api/analyticsApi";

const periodToMonths = {
  week: 3,
  month: 6,
  quarter: 9,
  year: 12,
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDateTime = (value) => {
  if (!value) return "--";
  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const statusLabel = (status) => {
  if (status === "SUCCESS") return "Thành công";
  if (status === "PENDING") return "Đang xử lý";
  if (status === "FAILED") return "Thất bại";
  if (status === "REFUNDED") return "Hoàn tiền";
  return status || "Không rõ";
};

const statusClass = (status) => {
  if (status === "SUCCESS") return "bg-emerald-100 text-emerald-700";
  if (status === "PENDING") return "bg-amber-100 text-amber-700";
  if (status === "FAILED") return "bg-red-100 text-red-700";
  if (status === "REFUNDED") return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-600";
};

const RevenuePage = () => {
  const [period, setPeriod] = useState("month");
  const [overview, setOverview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverview = async (selectedPeriod) => {
    try {
      setIsLoading(true);
      setError("");

      const months = periodToMonths[selectedPeriod] || 6;
      const response = await analyticsApi.getOverview({ months, top: 5, recent: 12 });
      setOverview(response?.data?.result || null);
    } catch (fetchError) {
      console.error("Failed to fetch revenue overview:", fetchError?.response?.data || fetchError);
      setError(fetchError?.response?.data?.message || "Không thể tải dữ liệu doanh thu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview(period);
  }, [period]);

  const summary = overview?.summary || {};

  const maxRevenue = useMemo(() => {
    const values = (overview?.monthlyRevenue || []).map((item) => Number(item.revenue || 0));
    return Math.max(...values, 1);
  }, [overview]);

  const stats = [
    {
      label: "Tổng doanh thu",
      value: formatCurrency(summary.totalRevenue || 0),
      change: `${Number(summary.totalEnrollments || 0).toLocaleString("vi-VN")} lượt đăng ký`,
      up: true,
    },
    {
      label: "Kỳ hiện tại",
      value: formatCurrency(summary.thisMonthRevenue || 0),
      change: `${Number(summary.publishedCourses || 0).toLocaleString("vi-VN")} khóa học đang hoạt động`,
      up: Number(summary.thisMonthRevenue || 0) >= 0,
    },
    {
      label: "Học viên duy nhất",
      value: Number(summary.totalLearners || 0).toLocaleString("vi-VN"),
      change: `${Number(summary.completedEnrollments || 0).toLocaleString("vi-VN")} đã hoàn thành`,
      up: true,
    },
    {
      label: "Khóa chờ duyệt",
      value: Number(summary.pendingCourses || 0).toLocaleString("vi-VN"),
      change: `${Number(summary.totalCourses || 0).toLocaleString("vi-VN")} tổng khóa học`,
      up: Number(summary.pendingCourses || 0) === 0,
    },
  ];

  return (
    <div className="p-7 flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-[22px] font-bold text-[#1a3a5c]">
            Doanh thu & Phân tích
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi doanh thu và hiệu suất khóa học theo dữ liệu thực tế.
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm bg-white text-slate-700 font-medium outline-none focus:border-[#1a3a5c] transition-colors"
        >
          <option value="week">Tuần này</option>
          <option value="month">Tháng này</option>
          <option value="quarter">Quý này</option>
          <option value="year">Năm nay</option>
        </select>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600">
          Đang tải dữ liệu doanh thu...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-slate-900">{stat.value}</span>
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      stat.up ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {stat.up ? "Ổn định" : "Cần theo dõi"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">{stat.change}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-6">Doanh thu theo tháng</h3>

              {(overview?.monthlyRevenue || []).length === 0 ? (
                <p className="text-sm text-slate-500">Chưa có dữ liệu doanh thu theo tháng.</p>
              ) : (
                <div className="flex items-end gap-2 h-48">
                  {(overview?.monthlyRevenue || []).map((item) => {
                    const amount = Number(item.revenue || 0);
                    const percent = Math.max(8, Math.round((amount / maxRevenue) * 100));

                    return (
                      <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full relative" style={{ height: "160px" }}>
                          <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 bg-gradient-to-t from-indigo-600 to-blue-500 rounded-t-md group"
                            style={{ height: `${percent}%` }}
                          >
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                              {formatCurrency(amount)}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{item.month}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Khóa học có doanh thu cao</h3>

              {(overview?.topCourses || []).length === 0 ? (
                <p className="text-sm text-slate-500">Chưa có dữ liệu.</p>
              ) : (
                <div className="space-y-4">
                  {(overview?.topCourses || []).map((course, index) => (
                    <div key={course.courseId}>
                      <div className="flex items-center justify-between mb-1 gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-bold text-slate-400 w-4">{index + 1}</span>
                          <span className="text-sm font-medium text-slate-700 truncate">{course.courseTitle}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-900 shrink-0">
                          {formatCurrency(course.revenue)}
                        </span>
                      </div>
                      <div className="ml-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                          style={{ width: `${Math.max(10, Math.round((Number(course.revenue || 0) / Math.max(Number(overview?.topCourses?.[0]?.revenue || 1), 1)) * 100))}%` }}
                        />
                      </div>
                      <p className="ml-6 mt-1 text-[11px] text-slate-500">
                        {Number(course.enrollments || 0).toLocaleString("vi-VN")} lượt đăng ký
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Giao dịch gần đây</h3>
              <span className="text-xs text-slate-500">{(overview?.recentTransactions || []).length} bản ghi</span>
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
                  {(overview?.recentTransactions || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-sm text-slate-500 text-center">
                        Chưa có giao dịch nào.
                      </td>
                    </tr>
                  ) : (
                    (overview?.recentTransactions || []).map((transaction) => (
                      <tr key={transaction.paymentId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 text-sm font-medium text-slate-900">TXN-{transaction.paymentId}</td>
                        <td className="px-6 py-3 text-sm text-slate-700">{transaction.studentName}</td>
                        <td className="px-6 py-3 text-sm text-slate-700">{transaction.courseTitle}</td>
                        <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-500">{formatDateTime(transaction.paidAt)}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statusClass(transaction.status)}`}>
                            {statusLabel(transaction.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RevenuePage;
