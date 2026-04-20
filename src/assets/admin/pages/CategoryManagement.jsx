import { useCallback, useEffect, useMemo, useState } from "react";
import categoryApi from "../../../api/categoryApi";
import fileUploadApi from "../../../api/fileUploadApi";
import { toast } from "react-hot-toast";
import { resolveMediaUrl } from "../../../utils/media";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const EMPTY_FORM = {
  name: "",
  description: "",
  iconUrl: "",
  parentId: "",
};

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await categoryApi.getCategories();
      const list = Array.isArray(response?.data?.result) ? response.data.result : [];
      setCategories(list);
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast.error("Không tải được danh sách danh mục.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return categories;
    return categories.filter(
      (cat) =>
        cat.name?.toLowerCase().includes(keyword) ||
        cat.description?.toLowerCase().includes(keyword) ||
        cat.parentName?.toLowerCase().includes(keyword)
    );
  }, [categories, searchTerm]);

  const parentCategoryOptions = useMemo(() => {
    if (!editingCategory) {
      return categories;
    }

    return categories.filter((category) => category.id !== editingCategory.id);
  }, [categories, editingCategory]);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name || "",
      description: category.description || "",
      iconUrl: category.iconUrl || "",
      parentId: category.parentId != null ? String(category.parentId) : "",
    });
    setShowModal(true);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      iconUrl: form.iconUrl?.trim() || null,
      parentId: form.parentId ? Number(form.parentId) : null,
    };

    try {
      setIsSaving(true);

      if (editingCategory) {
        const response = await categoryApi.updateCategory(editingCategory.id, payload);
        const updated = response?.data?.result || { ...editingCategory, ...payload };
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updated : c))
        );
        toast.success("Cập nhật danh mục thành công.");
      } else {
        const response = await categoryApi.createCategory(payload);
        const created = response?.data?.result || { id: Date.now(), ...payload };
        setCategories((prev) => [created, ...prev]);
        toast.success("Tạo danh mục thành công.");
      }

      setShowModal(false);
      setEditingCategory(null);
      setForm({ ...EMPTY_FORM });
    } catch (error) {
      const msg = error?.response?.data?.message || "Thao tác thất bại.";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadIcon = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    try {
      setIsUploadingIcon(true);

      const uploadResponse = await fileUploadApi.uploadFiles({
        files: [file],
        fileType: "IMAGE",
        folderName: "btm-learning/category-icons",
      });

      const uploaded = uploadResponse?.data?.result?.[0];
      const iconUrl = uploaded?.filePath || "";

      if (!iconUrl) {
        throw new Error("Upload icon không thành công.");
      }

      handleChange("iconUrl", iconUrl);
      toast.success("Upload icon danh mục thành công.");
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || "Upload icon thất bại.";
      toast.error(msg);
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleDelete = async (category) => {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa danh mục "${category.name}"?`);
    if (!confirmed) return;

    try {
      await categoryApi.deleteCategory(category.id);
      setCategories((prev) => prev.filter((c) => c.id !== category.id));
      toast.success("Đã xóa danh mục.");
    } catch (error) {
      const msg = error?.response?.data?.message || "Xóa danh mục thất bại.";
      toast.error(msg);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Quản lý Danh mục</h1>
          <p className="text-sm text-gray-500 mt-1">
            Thêm, sửa, xóa danh mục khóa học.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#1a2b4c] hover:bg-opacity-90 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Thêm danh mục
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Tổng danh mục</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Đang hoạt động</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">
              {categories.filter((c) => c.isActive !== false).length}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Đã vô hiệu</p>
            <h3 className="text-2xl font-bold text-red-600 mt-1">
              {categories.filter((c) => c.isActive === false).length}
            </h3>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mô tả..."
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Icon</th>
                  <th className="px-6 py-4">Tên danh mục</th>
                  <th className="px-6 py-4">Danh mục cha</th>
                  <th className="px-6 py-4">Slug</th>
                  <th className="px-6 py-4">Mô tả</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày tạo</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500">
                      Đang tải danh mục...
                    </td>
                  </tr>
                ) : filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500">
                      Không tìm thấy danh mục nào.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        #{category.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.iconUrl ? (
                          <img
                            src={resolveMediaUrl(category.iconUrl)}
                            alt={category.name}
                            className="h-9 w-9 rounded-lg border border-gray-200 object-cover"
                          />
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-bold text-gray-900 text-sm">{category.name}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {category.parentName || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                          {category.slug || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                        {category.description || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {category.isActive !== false ? (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-green-50 text-green-700 border border-green-200">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-50 text-red-700 border border-red-200">
                            Vô hiệu
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(category.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(category)}
                            className="px-3 py-1.5 text-xs rounded border border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="px-3 py-1.5 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50 font-semibold transition-colors"
                          >
                            Xóa
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
                {editingCategory ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
              </h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="VD: Lập trình, Thiết kế, Marketing"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Mô tả
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Mô tả ngắn gọn về danh mục..."
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Danh mục cha
                </label>
                <select
                  value={form.parentId}
                  onChange={(e) => handleChange("parentId", e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">Không có (danh mục gốc)</option>
                  {parentCategoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Icon danh mục
                </label>

                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleUploadIcon}
                      className="hidden"
                      disabled={isUploadingIcon}
                    />
                    {isUploadingIcon ? "Đang upload..." : "Upload icon"}
                  </label>

                  {form.iconUrl ? (
                    <button
                      type="button"
                      onClick={() => handleChange("iconUrl", "")}
                      className="px-3 py-2 text-xs rounded border border-red-300 text-red-600 hover:bg-red-50 font-semibold transition-colors"
                    >
                      Xóa icon
                    </button>
                  ) : null}
                </div>

                {form.iconUrl ? (
                  <div className="mt-3 flex items-center gap-3">
                    <img
                      src={resolveMediaUrl(form.iconUrl)}
                      alt="category-icon-preview"
                      className="h-11 w-11 rounded-lg border border-gray-200 object-cover"
                    />
                    <p className="text-xs text-gray-500 break-all">{form.iconUrl}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-xs text-gray-500">Chưa có icon.</p>
                )}
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
                {isSaving ? "Đang lưu..." : editingCategory ? "Cập nhật" : "Tạo mới"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
