import { useState } from "react";

// import { getProfile, updateProfile } from "../../../api/courses";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "Bình Phạm",
    email: "binhpham@gmail.com",
    phone: "0912345678",
    bio: "Sinh viên CNTT đam mê lập trình web và thiết kế UI/UX. Đang tìm hiểu về React và Next.js.",
    website: "https://binhpham.dev",
    location: "TP. Hồ Chí Minh",
    joinDate: "01/01/2026",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    course: true,
    marketing: false,
    newFeature: true,
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // TODO: Call API to update profile
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPasswords({ current: "", newPass: "", confirm: "" });
    // TODO: Call API to change password
  };

  const tabs = [
    { id: "profile", label: "Thông tin cá nhân", icon: "👤" },
    { id: "password", label: "Đổi mật khẩu", icon: "🔒" },
    { id: "notifications", label: "Thông báo", icon: "🔔" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
            Cài đặt tài khoản
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Quản lý thông tin cá nhân và tùy chỉnh tài khoản
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-56 flex-shrink-0">
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-6 animate-fade-in">
                {/* Avatar Section */}
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-100 dark:border-white/[0.06]">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/20">
                    {profile.fullName
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(-2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {profile.fullName}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Tham gia từ {profile.joinDate}
                    </p>
                    <button className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                      Đổi ảnh đại diện
                    </button>
                  </div>
                </div>

                <form onSubmit={handleProfileSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white disabled:opacity-60 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white disabled:opacity-60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white disabled:opacity-60 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Địa điểm
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white disabled:opacity-60 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profile.website}
                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                        disabled={!isEditing}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white disabled:opacity-60 outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Giới thiệu bản thân
                      </label>
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        disabled={!isEditing}
                        rows={3}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white disabled:opacity-60 outline-none focus:border-indigo-500 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-white/[0.06]">
                    {isEditing ? (
                      <>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                        >
                          Lưu thay đổi
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-5 py-2.5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                          Hủy
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                      >
                        Chỉnh sửa
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === "password" && (
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                  Đổi mật khẩu
                </h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwords.newPass}
                      onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Cập nhật mật khẩu
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-white/[0.06] p-6 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                  Cài đặt thông báo
                </h3>
                <div className="space-y-5">
                  {[
                    { key: "email", label: "Thông báo qua email", desc: "Nhận thông báo quan trọng qua email" },
                    { key: "course", label: "Cập nhật khóa học", desc: "Nhận thông báo khi khóa học có nội dung mới" },
                    { key: "marketing", label: "Khuyến mãi", desc: "Nhận thông tin về các chương trình ưu đãi" },
                    { key: "newFeature", label: "Tính năng mới", desc: "Nhận thông báo về các tính năng mới của nền tảng" },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-white/[0.04] last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          {item.label}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            [item.key]: !notifications[item.key],
                          })
                        }
                        className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
                          notifications[item.key]
                            ? "bg-indigo-600"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${
                            notifications[item.key]
                              ? "translate-x-[22px]"
                              : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
