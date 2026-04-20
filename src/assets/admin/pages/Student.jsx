import { useCallback, useEffect, useMemo, useState } from "react";
import userApi from "../../../api/userApi";

const ROLE_OPTIONS = [
  { value: "ALL", label: "Tất cả vai trò" },
  { value: "STUDENT", label: "Học viên" },
  { value: "INSTRUCTOR", label: "Giảng viên" },
  { value: "ADMIN", label: "Quản trị viên" },
];

const mapRoleLabel = (role) => {
  if (role === "ADMIN") return "Quản trị viên";
  if (role === "INSTRUCTOR") return "Giảng viên";
  return "Học viên";
};

const roleBadgeClass = (role) => {
  if (role === "ADMIN") return "bg-gray-800 text-white";
  if (role === "INSTRUCTOR") return "bg-purple-100 text-purple-700";
  return "bg-blue-50 text-blue-600";
};

const statusBadge = (isActive) => {
  if (isActive) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm font-medium text-gray-700">Hoạt động</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <span className="text-sm font-medium text-red-600">Bị khóa</span>
    </div>
  );
};

const formatDate = (value) => {
  if (!value) return "--";
  return new Date(value).toLocaleDateString("vi-VN");
};

const getInitials = (name) => {
  if (!name) return "NA";
  const words = name.trim().split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const avatarPalette = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-cyan-500",
  "bg-rose-500",
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("all");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const params = {
        page,
        size: pageSize,
      };

      if (searchTerm.trim()) {
        params.keyword = searchTerm.trim();
      }

      if (filterRole !== "ALL") {
        params.role = filterRole;
      }

      if (filterStatus !== "all") {
        params.isActive = filterStatus === "active";
      }

      const response = await userApi.getUsers(params);
      const pageData = response?.data?.result;

      setUsers(pageData?.content || []);
      setTotalElements(pageData?.totalElements || 0);
      setTotalPages(pageData?.totalPages || 1);
    } catch (fetchError) {
      console.error("Failed to fetch users:", fetchError?.response?.data || fetchError);
      setError(fetchError?.response?.data?.message || "Không thể tải danh sách người dùng.");
    } finally {
      setIsLoading(false);
    }
  }, [filterRole, filterStatus, page, pageSize, searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleActive = async (userId) => {
    try {
      await userApi.toggleActive(userId);
      await fetchUsers();
    } catch (toggleError) {
      console.error("Failed to toggle user active state:", toggleError?.response?.data || toggleError);
      alert(toggleError?.response?.data?.message || "Cập nhật trạng thái tài khoản thất bại");
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await userApi.changeRole(userId, role);
      await fetchUsers();
    } catch (changeError) {
      console.error("Failed to change user role:", changeError?.response?.data || changeError);
      alert(changeError?.response?.data?.message || "Đổi quyền tài khoản thất bại");
    }
  };

  const localStats = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((user) => user.role === "STUDENT").length,
      instructors: users.filter((user) => user.role === "INSTRUCTOR").length,
      locked: users.filter((user) => !user.isActive).length,
    };
  }, [users]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Quản lý Người dùng</h1>
          <p className="text-sm text-gray-500 mt-1">Phân quyền, theo dõi hoạt động và quản lý tài khoản.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 space-y-6">
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Người dùng trang hiện tại</p>
            <h3 className="text-2xl font-bold text-gray-900">{localStats.total}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Học viên</p>
            <h3 className="text-2xl font-bold text-gray-900">{localStats.students}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Giảng viên</p>
            <h3 className="text-2xl font-bold text-gray-900">{localStats.instructors}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <p className="text-sm text-gray-500 font-medium">Tài khoản bị khóa</p>
            <h3 className="text-2xl font-bold text-gray-900">{localStats.locked}</h3>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(event) => {
                setPage(0);
                setSearchTerm(event.target.value);
              }}
            />
          </div>

          <div className="flex gap-3">
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 bg-white text-sm text-gray-700 font-medium cursor-pointer"
              value={filterRole}
              onChange={(event) => {
                setPage(0);
                setFilterRole(event.target.value);
              }}
            >
              {ROLE_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 bg-white text-sm text-gray-700 font-medium cursor-pointer"
              value={filterStatus}
              onChange={(event) => {
                setPage(0);
                setFilterStatus(event.target.value);
              }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="banned">Bị khóa</option>
            </select>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Người dùng</th>
                  <th className="px-6 py-4">Vai trò</th>
                  <th className="px-6 py-4">Ngày tham gia</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Đang tải danh sách người dùng...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-red-600">
                      {error}
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy người dùng nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full ${avatarPalette[index % avatarPalette.length]} flex items-center justify-center text-white font-bold shadow-sm shrink-0`}
                          >
                            {getInitials(user.fullName || user.email)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{user.fullName || "Chưa cập nhật"}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 text-xs font-bold rounded ${roleBadgeClass(user.role)}`}>
                            {mapRoleLabel(user.role)}
                          </span>

                          <select
                            value={user.role}
                            onChange={(event) => handleRoleChange(user.id, event.target.value)}
                            className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                          >
                            <option value="STUDENT">STUDENT</option>
                            <option value="INSTRUCTOR">INSTRUCTOR</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{formatDate(user.createdAt)}</span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">{statusBadge(user.isActive)}</td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleToggleActive(user.id)}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                            user.isActive
                              ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {user.isActive ? "Khóa" : "Mở khóa"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Tổng số bản ghi: <span className="font-bold text-gray-900">{totalElements}</span>
            </span>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setPage((prev) => Math.max(0, prev - 1))}
                disabled={page === 0}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="text-sm text-gray-600">
                Trang <strong>{page + 1}</strong> / {Math.max(totalPages, 1)}
              </span>
              <button
                onClick={() => setPage((prev) => (prev + 1 < totalPages ? prev + 1 : prev))}
                disabled={page + 1 >= totalPages}
                className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
