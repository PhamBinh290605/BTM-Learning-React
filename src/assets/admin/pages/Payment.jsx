import { useEffect, useMemo, useState } from "react";
import analyticsApi from "../../../api/analyticsApi";

const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
};

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusConfig = {
  SUCCESS: { label: "Thành công", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  FAILED: { label: "Thất bại", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  PENDING: { label: "Đang xử lý", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  REFUNDED: { label: "Đã hoàn", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

const PaymentPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await analyticsApi.getOverview({ months: 12, top: 5, recent: 50 });
      setAnalytics(response?.data?.result || null);
    } catch (error) {
      console.error("Failed to load payment data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const transactions = useMemo(() => {
    return analytics?.recentTransactions || [];
  }, [analytics]);

  const filteredTransactions = useMemo(() => {
    let result = transactions;

    if (statusFilter !== "ALL") {
      result = result.filter((t) => t.status === statusFilter);
    }

    const keyword = searchTerm.trim().toLowerCase();
    if (keyword) {
      result = result.filter(
        (t) =>
          t.studentName?.toLowerCase().includes(keyword) ||
          t.courseTitle?.toLowerCase().includes(keyword) ||
          String(t.paymentId).includes(keyword)
      );
    }

    return result;
  }, [transactions, searchTerm, statusFilter]);

  const summary = analytics?.summary || {};

  const stats = [
    {
      label: "Tổng doanh thu",
      value: formatCurrency(summary.totalRevenue || 0),
      color: "text-slate-900",
      iconBg: "bg-indigo-100",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M3 11l3-3 2 2 5-5" stroke="#3730a3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M3 13h10" stroke="#3730a3" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      label: "Doanh thu tháng này",
      value: formatCurrency(summary.thisMonthRevenue || 0),
      color: "text-emerald-700",
      iconBg: "bg-emerald-100",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6" stroke="#15803d" strokeWidth="1.5" />
          <path d="M5 8l2 2 4-4" stroke="#15803d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "Tổng giao dịch",
      value: transactions.length.toString(),
      color: "text-slate-900",
      iconBg: "bg-amber-100",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12v8H2z" stroke="#92400e" strokeWidth="1.5" />
          <path d="M2 7h12" stroke="#92400e" strokeWidth="1.5" />
        </svg>
      ),
    },
    {
      label: "Tổng đăng ký",
      value: Number(summary.totalEnrollments || 0).toLocaleString("vi-VN"),
      color: "text-slate-900",
      iconBg: "bg-pink-100",
      icon: (
        <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="5" r="3" stroke="#9d174d" strokeWidth="1.5" />
          <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#9d174d" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="p-7">
        <div className="bg-white border border-slate-200 rounded-xl p-6 text-sm text-slate-600">
          Đang tải dữ liệu thanh toán...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Quản lý Thanh toán</h1>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi tất cả giao dịch thanh toán trên hệ thống.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
        >
          Làm mới
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <h3 className={`text-xl font-bold ${stat.color} mt-1`}>{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center gap-3">
            <input
              type="text"
              placeholder="Tìm theo mã GD, học viên, khóa học..."
              className="flex-1 min-w-[200px] max-w-md px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="SUCCESS">Thành công</option>
              <option value="PENDING">Đang xử lý</option>
              <option value="FAILED">Thất bại</option>
              <option value="REFUNDED">Đã hoàn</option>
            </select>
            <span className="text-sm text-slate-500">
              {filteredTransactions.length} giao dịch
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-3">Mã GD</th>
                  <th className="px-6 py-3">Học viên</th>
                  <th className="px-6 py-3">Khóa học</th>
                  <th className="px-6 py-3">Số tiền</th>
                  <th className="px-6 py-3">Ngày thanh toán</th>
                  <th className="px-6 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-sm text-slate-500 text-center">
                      Chưa có giao dịch nào.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => {
                    const config = statusConfig[transaction.status] || statusConfig.PENDING;
                    return (
                      <tr key={transaction.paymentId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-3 text-sm font-medium text-slate-900">
                          TXN-{transaction.paymentId}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-700">
                          {transaction.studentName || "—"}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-700 max-w-xs truncate">
                          {transaction.courseTitle || "—"}
                        </td>
                        <td className="px-6 py-3 text-sm font-semibold text-slate-900">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td className="px-6 py-3 text-sm text-slate-500">
                          {formatDate(transaction.paidAt)}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
                            {config.label}
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
    </div>
  );
};

export default PaymentPage;
