import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import userApi from "../../api/userApi";

const MyProfile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // State khớp với UserProfile Backend
  const [profile, setProfile] = useState({
    id: null,
    fullName: "",
    email: "",
    bio: "",
    avatarUrl: null,
    role: "",
    isActive: true,
    createdAt: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --- FETCH PROFILE ---
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await userApi.getMyProfile();
      if (res.data.code === 1000) {
        setProfile(res.data.result);
      }
    } catch {
      toast.error("Không thể tải thông tin cá nhân");
    } finally {
      setLoading(false);
    }
  };

  // --- UPDATE PROFILE ---
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profile.fullName || profile.fullName.trim().length < 2) {
      toast.error("Họ và tên phải có ít nhất 2 ký tự.");
      return;
    }
    setLoading(true);
    try {
      const updateData = {
        fullName: profile.fullName.trim(),
        bio: profile.bio || "",
      };
      const res = await userApi.updateProfile(updateData);
      if (res.data.code === 1000) {
        setProfile(res.data.result);
        toast.success("Cập nhật thành công!");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  // --- UPLOAD AVATAR ---
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ảnh tối đa 2MB");
      return;
    }

    setLoading(true);
    try {
      const res = await userApi.uploadAvatar(file);
      if (res.data.code === 1000) {
        setProfile((prev) => ({ ...prev, avatarUrl: res.data.result.avatarUrl }));
        toast.success("Đổi ảnh đại diện thành công!");
      }
    } catch {
      toast.error("Lỗi upload ảnh");
    } finally {
      setLoading(false);
    }
  };

  // --- CHANGE PASSWORD ---
  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin mật khẩu.");
      return;
    }
    if (passwords.newPassword.length < 8) {
      toast.error("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await userApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      if (res.data.code === 1000) {
        toast.success("Đổi mật khẩu thành công!");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("") || "U";
  };

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* Cover */}
      <div className="h-48 bg-gradient-to-r from-[#1a2b4c] to-blue-800 relative z-0">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto px-8 -mt-16 relative z-10 flex gap-8 items-start flex-col md:flex-row">
        {/* Left: Profile Card */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group">
              <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-blue-600 text-3xl font-bold overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(profile.fullName)
                )}
              </div>
              <button
                className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-full border-2 border-white hover:bg-gray-800 transition-colors shadow-sm"
                title="Thay đổi ảnh đại diện"
                onClick={() => fileInputRef.current?.click()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {profile.fullName || "Đang tải..."}
            </h2>
            <p className="text-sm text-gray-500 mt-1">{profile.email}</p>

            <div className="flex gap-2 mt-4">
              {profile.role && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                  {profile.role === "ADMIN" ? "Quản trị viên" : profile.role === "INSTRUCTOR" ? "Giảng viên" : "Học viên"}
                </span>
              )}
            </div>
            {profile.createdAt && (
              <p className="text-xs text-gray-400 mt-3">
                Tham gia từ {formatDate(profile.createdAt)}
              </p>
            )}
          </div>

          {/* Nav */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === "personal" ? "border-blue-600 bg-blue-50/50 text-blue-700" : "border-transparent text-gray-600 hover:bg-gray-50"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 border-t border-t-gray-100 ${activeTab === "security" ? "border-l-blue-600 bg-blue-50/50 text-blue-700" : "border-l-transparent text-gray-600 hover:bg-gray-50"}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Mật khẩu & Bảo mật
              </button>
            </nav>
          </div>
        </div>

        {/* Right: Tab Content */}
        <div className="flex-1 w-full bg-white rounded-xl border border-gray-200 shadow-sm mt-16 md:mt-0 p-8">
          {/* TAB: Thông tin cá nhân */}
          {activeTab === "personal" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Hồ sơ cá nhân
              </h2>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Họ và tên */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                      value={profile.fullName || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  {/* Email (Disabled) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Địa chỉ Email (Không thể thay đổi)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg pl-10 pr-4 py-2.5 outline-none text-sm cursor-not-allowed"
                        value={profile.email || ""}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-400 absolute left-3 top-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Giới thiệu bản thân */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-sm text-gray-800 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Viết một vài dòng giới thiệu về bản thân bạn..."
                    value={profile.bio || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    disabled={!isEditing}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Tiểu sử của bạn sẽ được hiển thị trên trang cá nhân công khai.
                  </p>
                </div>

                {/* Buttons */}
                <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          fetchProfile(); // revert changes
                        }}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#1a2b4c] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors shadow-sm disabled:opacity-60"
                      >
                        {loading ? "Đang lưu..." : "Lưu thay đổi"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="bg-[#1a2b4c] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors shadow-sm"
                    >
                      Chỉnh sửa hồ sơ
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* TAB: Mật khẩu & Bảo mật */}
          {activeTab === "security" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Cập nhật mật khẩu
              </h2>

              <form
                onSubmit={handleSaveSecurity}
                className="space-y-5 max-w-md"
              >
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Mật khẩu phải có ít nhất 8 ký tự.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={passwords.confirmPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, confirmPassword: e.target.value })
                    }
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-800"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#1a2b4c] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors shadow-sm disabled:opacity-60"
                  >
                    {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
