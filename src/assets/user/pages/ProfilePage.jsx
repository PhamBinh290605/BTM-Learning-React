import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import userApi from "../../../api/userApi";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // State Profile khớp với UserProfile Backend trả về
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    bio: "",
    avatarUrl: null,
    joinDate: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // --- 1. FETCH PROFILE ON MOUNT ---
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

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        fullName: profile.fullName,
        bio: profile.bio
      };
      const res = await userApi.updateProfile(updateData);
      if (res.data.code === 1000) {
        toast.success("Cập nhật thành công!");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. XỬ LÝ UPLOAD AVATAR ---
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
        setProfile({ ...profile, avatarUrl: res.data.result.avatarUrl });
        toast.success("Đổi ảnh đại diện thành công!");
      }
    } catch {
      toast.error("Lỗi upload ảnh");
    } finally {
      setLoading(false);
    }
  };

  // --- 4. XỬ LÝ ĐỔI MẬT KHẨU ---
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await userApi.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
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

  const tabs = [
    { id: "profile", label: "Thông tin cá nhân", icon: "👤" },
    { id: "password", label: "Đổi mật khẩu", icon: "🔒" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Cài đặt tài khoản</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 space-y-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === t.id ? "bg-indigo-600 shadow-lg shadow-indigo-600/20" : "hover:bg-white/5 text-slate-400"
                  }`}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="flex-1 bg-slate-900/50 border border-white/5 rounded-2xl p-6">

            {activeTab === "profile" && (
              <div className="animate-in fade-in duration-500">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-white/5">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-2xl bg-indigo-500 flex items-center justify-center text-3xl font-bold overflow-hidden shadow-2xl">
                      {profile.avatarUrl ? (
                        <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        profile.fullName?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current.click()}
                      className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all shadow-lg"
                      title="Đổi ảnh đại diện"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                    </button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{profile.fullName}</h2>
                    <p className="text-slate-400 text-sm">{profile.email}</p>
                  </div>
                </div>

                {/* Form Profile */}
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Họ và tên</label>
                      <input
                        type="text"
                        value={profile.fullName || ""}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-400">Email (Không thể thay đổi)</label>
                      <input
                        type="email"
                        value={profile.email || ""}
                        disabled // LUÔN DISABLE ĐỂ ĐẢM BẢO AN TOÀN
                        className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-2.5 text-slate-500 cursor-not-allowed"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-medium text-slate-400">Giới thiệu bản thân</label>
                      <textarea
                        value={profile.bio || ""}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={4}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500 transition-all disabled:opacity-50 resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    {isEditing ? (
                      <>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-500 transition-all min-w-[120px]">
                          {loading ? "Đang lưu..." : "Lưu thay đổi"}
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2.5 bg-slate-800 rounded-xl font-semibold hover:bg-slate-700 transition-all">
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button type="button" onClick={() => setIsEditing(true)} className="px-6 py-2.5 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-500 transition-all">
                        Chỉnh sửa hồ sơ
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {activeTab === "password" && (
              <div className="animate-in slide-in-from-right duration-500 max-w-md">
                <h3 className="text-lg font-bold mb-6">Đổi mật khẩu</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                      required
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      required
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      required
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-indigo-600 rounded-xl font-semibold mt-4 hover:bg-indigo-500 transition-all">
                    {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;