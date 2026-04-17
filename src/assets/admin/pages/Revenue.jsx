import { useState } from "react";

// import { getRevenueStats } from "../../../api/revenue";

const RevenuePage = () => {
  const [period, setPeriod] = useState("month");

  // ─── MOCK DATA ───
  const stats = [
    { label: "Tổng doanh thu", value: "₫48.2M", change: "+22%", up: true, color: "bg-emerald-100 text-emerald-600", darkColor: "dark:bg-emerald-500/10 dark:text-emerald-400" },
    { label: "Tháng này", value: "₫12.8M", change: "+15%", up: true, color: "bg-blue-100 text-blue-600", darkColor: "dark:bg-blue-500/10 dark:text-blue-400" },
    { label: "Đăng ký mới", value: "342", change: "+8%", up: true, color: "bg-violet-100 text-violet-600", darkColor: "dark:bg-violet-500/10 dark:text-violet-400" },
    { label: "Tỷ lệ hoàn", value: "2.1%", change: "-0.3%", up: false, color: "bg-amber-100 text-amber-600", darkColor: "dark:bg-amber-500/10 dark:text-amber-400" },
  ];

  const monthlyRevenue = [
    { month: "T1", value: 4200000, percent: 35 },
    { month: "T2", value: 5100000, percent: 42 },
    { month: "T3", value: 6800000, percent: 57 },
    { month: "T4", value: 5500000, percent: 46 },
    { month: "T5", value: 7200000, percent: 60 },
    { month: "T6", value: 8100000, percent: 68 },
    { month: "T7", value: 6900000, percent: 58 },
    { month: "T8", value: 9200000, percent: 77 },
    { month: "T9", value: 10500000, percent: 88 },
    { month: "T10", value: 11200000, percent: 93 },
    { month: "T11", value: 9800000, percent: 82 },
    { month: "T12", value: 12800000, percent: 100 },
  ];

  const topCourses = [
    { name: "ReactJS & Next.js Fullstack", revenue: "₫15.2M", students: 1240, percent: 32 },
    { name: "Python Data Science", revenue: "₫9.8M", students: 620, percent: 20 },
    { name: "UI/UX với Figma", revenue: "₫8.5M", students: 850, percent: 18 },
    { name: "Docker & CI/CD", revenue: "₫6.2M", students: 430, percent: 13 },
    { name: "Digital Marketing", revenue: "₫4.9M", students: 980, percent: 10 },
  ];

  const transactions = [
    { id: "TXN-001", student: "Nguyễn Văn An", course: "ReactJS Fullstack", amount: "599,000đ", date: "17/04/2026", status: "Thành công" },
    { id: "TXN-002", student: "Trần Thị Bích", course: "Python DS", amount: "799,000đ", date: "17/04/2026", status: "Thành công" },
    { id: "TXN-003", student: "Lê Minh Tuấn", course: "ReactJS Fullstack", amount: "599,000đ", date: "16/04/2026", status: "Thành công" },
    { id: "TXN-004", student: "Phạm Hồng Đức", course: "UI/UX Figma", amount: "0đ", date: "16/04/2026", status: "Miễn phí" },
    { id: "TXN-005", student: "Hoàng Thị Mai", course: "Docker CI/CD", amount: "699,000đ", date: "15/04/2026", status: "Đang xử lý" },
    { id: "TXN-006", student: "Vũ Đình Khoa", course: "ReactJS Fullstack", amount: "599,000đ", date: "15/04/2026", status: "Hoàn tiền" },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  return (
    <div className="p-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-[22px] font-bold text-[#1a3a5c]">
            Doanh thu & Phân tích
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi doanh thu và hiệu suất khóa học
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

      {/* Stats Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
          >
            <p className="text-sm text-slate-500 font-medium mb-1">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-slate-900">
                {stat.value}
              </span>
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                  stat.up
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-6">
            Doanh thu theo tháng
          </h3>
          <div className="flex items-end gap-2 h-48">
            {monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: "160px" }}>
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 bg-gradient-to-t from-indigo-600 to-violet-500 rounded-t-md hover:from-indigo-700 hover:to-violet-600 transition-all cursor-pointer group"
                    style={{ height: `${m.percent}%` }}
                  >
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {formatCurrency(m.value)}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {m.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Courses */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">
            Khóa học có doanh thu cao
          </h3>
          <div className="space-y-4">
            {topCourses.map((course, i) => (
              <div key={course.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 w-4">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[140px]">
                      {course.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {course.revenue}
                  </span>
                </div>
                <div className="ml-6 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ width: `${course.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Giao dịch gần đây</h3>
          <button className="text-sm text-indigo-600 font-medium hover:underline">
            Xem tất cả
          </button>
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
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">
                    {txn.id}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {txn.student}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600">
                    {txn.course}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                    {txn.amount}
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-400">
                    {txn.date}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        txn.status === "Thành công"
                          ? "bg-emerald-100 text-emerald-700"
                          : txn.status === "Miễn phí"
                          ? "bg-blue-100 text-blue-700"
                          : txn.status === "Đang xử lý"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;
