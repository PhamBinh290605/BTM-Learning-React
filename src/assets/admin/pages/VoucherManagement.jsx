import { useCallback, useEffect, useMemo, useState } from "react";
import voucherApi from "../../../api/voucherApi";
import { toast } from "react-hot-toast";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EMPTY_FORM = {
  code: "",
  discountPercent: 10,
  quantity: 100,
  startDate: "",
  expirationDate: "",
  isActive: true,
};

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  const fetchVouchers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await voucherApi.applyVoucher({ code: "", courseId: 0 }).catch(() => null);
      // Voucher API doesn't have a list endpoint in backend, so we use analytics or manage locally
      // For now we'll handle the list via the create/update/delete pattern
      setVouchers((prev) => prev);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const filteredVouchers = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return vouchers;
    return vouchers.filter(
      (v) =>
        v.code?.toLowerCase().includes(keyword) ||
        String(v.discountPercent).includes(keyword)
    );
  }, [vouchers, searchTerm]);

  const openCreateModal = () => {
    setEditingVoucher(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEditModal = (voucher) => {
    setEditingVoucher(voucher);
    setForm({
      code: voucher.code || "",
      discountPercent: voucher.discountPercent || 10,
      quantity: voucher.quantity || 100,
      startDate: formatDateTime(voucher.startDate),
      expirationDate: formatDateTime(voucher.expirationDate),
      isActive: voucher.isActive !== false,
    });
    setShowModal(true);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.code.trim()) {
      toast.error("Vui lòng nhập mã voucher.");
      return;
    }
    if (form.discountPercent < 1 || form.discountPercent > 100) {
      toast.error("Phần trăm giảm giá phải từ 1 đến 100.");
      return;
    }
    if (form.quantity < 1) {
      toast.error("Số lượng phải lớn hơn 0.");
      return;
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountPercent: Number(form.discountPercent),
      quantity: Number(form.quantity),
      startDate: form.startDate ? new Date(form.startDate).toISOString() : null,
      expirationDate: form.expirationDate ? new Date(form.expirationDate).toISOString() : null,
      isActive: form.isActive,
    };

    try {
      setIsSaving(true);

      if (editingVoucher) {
        const response = await voucherApi.updateVoucher(editingVoucher.id, payload);
        const updated = response?.data?.result || { ...editingVoucher, ...payload };
        setVouchers((prev) =>
          prev.map((v) => (v.id === editingVoucher.id ? updated : v))
        );
        toast.success("Cập nhật voucher thành công.");
      } else {
        const response = await voucherApi.createVoucher(payload);
        const created = response?.data?.result || { id: Date.now(), ...payload, usedCount: 0 };
        setVouchers((prev) => [created, ...prev]);
        toast.success("Tạo voucher thành công.");
      }

      setShowModal(false);
      setEditingVoucher(null);
      setForm(EMPTY_FORM);
    } catch (error) {
      const msg = error?.response?.data?.message || "Thao tác thất bại.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (voucher) => {
    const confirmed = window.confirm(`Bạn có chắc muốn vô hiệu hóa voucher "${voucher.code}"?`);
    if (!confirmed) return;

    try {
      await voucherApi.deleteVoucher(voucher.id);
      setVouchers((prev) =>
        prev.map((v) => (v.id === voucher.id ? { ...v, isActive: false } : v))
      );
      toast.success("Đã vô hiệu hóa voucher.");
    } catch (error) {
      const msg = error?.response?.data?.message || "Vô hiệu hóa thất bại.";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Quản lý Voucher</h1>
          <p className="text-sm text-gray-500 mt-1">
            Tạo và quản lý mã khuyến mãi cho học viên.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#1a2b4c] hover:bg-opacity-90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Tạo voucher mới
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Tổng voucher</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{vouchers.length}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Đang hoạt động</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {vouchers.filter((v) => v.isActive).length}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Đã hết hạn / Vô hiệu</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">
              {vouchers.filter((v) => !v.isActive).length}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Tổng lượt sử dụng</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">
              {vouchers.reduce((sum, v) => sum + (v.usedCount || 0), 0)}
            </h3>
          </div>
        </div>

        {/* Search & Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <input
              type="text"
              placeholder="Tìm theo mã voucher..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Mã voucher</th>
                  <th className="px-6 py-4">Giảm giá</th>
                  <th className="px-6 py-4">Số lượng</th>
                  <th className="px-6 py-4">Đã dùng</th>
                  <th className="px-6 py-4">Ngày bắt đầu</th>
                  <th className="px-6 py-4">Ngày hết hạn</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-500">
                      {isLoading ? "Đang tải..." : "Chưa có voucher nào. Hãy tạo voucher đầu tiên!"}
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((voucher) => (
                    <tr key={voucher.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-mono font-bold text-sm text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                          {voucher.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-emerald-700 text-sm">
                          -{voucher.discountPercent}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {voucher.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {voucher.usedCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(voucher.startDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(voucher.expirationDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {voucher.isActive ? (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-green-50 text-green-700 border border-green-200">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-50 text-red-700 border border-red-200">
                            Vô hiệu
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(voucher)}
                            className="px-3 py-1.5 text-xs rounded border border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(voucher)}
                            disabled={!voucher.isActive}
                            className="px-3 py-1.5 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50 font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Vô hiệu
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 font-serif">
                {editingVoucher ? "Chỉnh sửa Voucher" : "Tạo Voucher mới"}
              </h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mã Voucher <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                  placeholder="VD: SALE50, NEWYEAR2026"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Giảm giá (%) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={form.discountPercent}
                    onChange={(e) => handleChange("discountPercent", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Số lượng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={(e) => handleChange("quantity", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ngày bắt đầu
                  </label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Ngày hết hạn
                  </label>
                  <input
                    type="datetime-local"
                    value={form.expirationDate}
                    onChange={(e) => handleChange("expirationDate", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => handleChange("isActive", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
                <span className="text-sm font-medium text-gray-700">Kích hoạt ngay</span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-[#1a2b4c] text-white rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSaving ? "Đang lưu..." : editingVoucher ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoucherManagement;
