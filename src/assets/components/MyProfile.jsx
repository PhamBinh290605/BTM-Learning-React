import React, { useState } from "react";

const MyProfile = () => {
  // --- 1. STATE QUẢN LÝ TAB ---
  const [activeTab, setActiveTab] = useState("personal"); // personal, security, notifications

  // --- 2. STATE DỮ LIỆU USER ---
  const [profile, setProfile] = useState({
    fullName: "Phạm Xuân Bình",
    email: "binhpx@gmail.com",
    phone: "0987654321",
    title: "Lập trình viên Backend",
    bio: "Đam mê lập trình web, đặc biệt là hệ sinh thái React. Luôn thích học hỏi công nghệ mới và chia sẻ kiến thức với cộng đồng.",
    website: "https://binhpx.vn",
    github: "github.com/binhpx",
  });

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    courseAnnouncements: true,
    promotions: false,
    pushNotifications: true,
  });

  // --- 3. HÀM XỬ LÝ LƯU ---
  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log("Đã lưu thông tin:", profile);
    alert("Cập nhật thông tin cá nhân thành công!");
  };

  const handleSaveSecurity = (e) => {
    e.preventDefault();
    alert("Đã cập nhật mật khẩu mới!");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* --- TOP BAR (Cover Photo) --- */}
      <div className="h-48 bg-gradient-to-r from-[#1a2b4c] to-blue-800 relative z-0">
        {/* Pattern mờ */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-6xl mx-auto px-8 -mt-16 relative z-10 flex gap-8 items-start flex-col md:flex-row">
        {/* CỘT TRÁI: PROFILE CARD & MENU (30%) */}
        <div className="w-full md:w-80 space-y-6">
          {/* Card Thông tin ngắn gọn */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4 group">
              <div className="w-24 h-24 rounded-full bg-blue-100 border-4 border-white shadow-md flex items-center justify-center text-blue-600 text-3xl font-bold overflow-hidden">
                {/* Giả lập Avatar bằng chữ cái đầu */}T
              </div>
              <button
                className="absolute bottom-0 right-0 p-1.5 bg-gray-900 text-white rounded-full border-2 border-white hover:bg-gray-800 transition-colors shadow-sm"
                title="Thay đổi ảnh đại diện"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {profile.fullName}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {profile.title || "Học viên"}
            </p>

            <div className="flex gap-2 mt-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                Học viên Pro
              </span>
            </div>
          </div>

          {/* Menu Điều hướng Tabs */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              <button
                onClick={() => setActiveTab("personal")}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 ${activeTab === "personal" ? "border-blue-600 bg-blue-50/50 text-blue-700" : "border-transparent text-gray-600 hover:bg-gray-50"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 border-t border-t-gray-100 ${activeTab === "security" ? "border-l-blue-600 bg-blue-50/50 text-blue-700" : "border-l-transparent text-gray-600 hover:bg-gray-50"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Mật khẩu & Bảo mật
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4 border-t border-t-gray-100 ${activeTab === "notifications" ? "border-l-blue-600 bg-blue-50/50 text-blue-700" : "border-l-transparent text-gray-600 hover:bg-gray-50"}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                Cài đặt thông báo
              </button>
            </nav>
          </div>
        </div>

        {/* CỘT PHẢI: NỘI DUNG TƯƠNG ỨNG VỚI TAB (70%) */}
        <div className="flex-1 w-full bg-white rounded-xl border border-gray-200 shadow-sm mt-16 md:mt-0 p-8">
          {/* --- TAB 1: THÔNG TIN CÁ NHÂN --- */}
          {activeTab === "personal" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Hồ sơ công khai
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-800"
                      value={profile.fullName}
                      onChange={(e) =>
                        setProfile({ ...profile, fullName: e.target.value })
                      }
                    />
                  </div>

                  {/* Tiêu đề */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Chức danh / Nghề nghiệp
                    </label>
                    <input
                      type="text"
                      placeholder="VD: Sinh viên, Lập trình viên..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-800"
                      value={profile.title}
                      onChange={(e) =>
                        setProfile({ ...profile, title: e.target.value })
                      }
                    />
                  </div>

                  {/* Email (Disabled) */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Địa chỉ Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        className="w-full border border-gray-200 bg-gray-50 text-gray-500 rounded-lg pl-10 pr-4 py-2.5 outline-none text-sm cursor-not-allowed"
                        value={profile.email}
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

                  {/* Số điện thoại */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-800"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Giới thiệu bản thân */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-sm text-gray-800 resize-none"
                    placeholder="Viết một vài dòng giới thiệu về bản thân bạn..."
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Tiểu sử của bạn sẽ được hiển thị trên trang cá nhân công
                    khai.
                  </p>
                </div>

                {/* Mạng xã hội */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 mt-2">
                    Liên kết mạng xã hội
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md h-10 w-28">
                        Website
                      </span>
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-r-md px-3 h-10 outline-none focus:border-blue-500 text-sm"
                        value={profile.website}
                        onChange={(e) =>
                          setProfile({ ...profile, website: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-md h-10 w-28">
                        GitHub
                      </span>
                      <input
                        type="text"
                        className="flex-1 border border-gray-300 rounded-r-md px-3 h-10 outline-none focus:border-blue-500 text-sm"
                        value={profile.github}
                        onChange={(e) =>
                          setProfile({ ...profile, github: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Nút Submit */}
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#1a2b4c] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors shadow-sm"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- TAB 2: MẬT KHẨU & BẢO MẬT --- */}
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-800"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-800"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-[#1a2b4c] text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors shadow-sm"
                  >
                    Cập nhật mật khẩu
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- TAB 3: CÀI ĐẶT THÔNG BÁO --- */}
          {activeTab === "notifications" && (
            <div className="animate-fade-in">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">
                Tùy chỉnh thông báo
              </h2>

              <div className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                    Thông báo qua Email
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group border border-gray-100 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">
                          Cập nhật hệ thống
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 block">
                          Nhận email khi có các thay đổi quan trọng về tài khoản
                          và hệ thống.
                        </span>
                      </div>
                      <div className="relative shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={notifications.emailUpdates}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              emailUpdates: e.target.checked,
                            })
                          }
                        />
                        <div
                          className={`block w-10 h-6 rounded-full transition-colors ${notifications.emailUpdates ? "bg-[#1a2b4c]" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.emailUpdates ? "transform translate-x-4" : ""}`}
                        ></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group border border-gray-100 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">
                          Thông báo khóa học
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 block">
                          Email nhắc nhở làm bài tập, bài học mới được thêm vào.
                        </span>
                      </div>
                      <div className="relative shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={notifications.courseAnnouncements}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              courseAnnouncements: e.target.checked,
                            })
                          }
                        />
                        <div
                          className={`block w-10 h-6 rounded-full transition-colors ${notifications.courseAnnouncements ? "bg-[#1a2b4c]" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.courseAnnouncements ? "transform translate-x-4" : ""}`}
                        ></div>
                      </div>
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group border border-gray-100 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <span className="text-sm font-bold text-gray-800 block">
                          Khuyến mãi & Sự kiện
                        </span>
                        <span className="text-xs text-gray-500 mt-0.5 block">
                          Nhận thông tin về các chương trình giảm giá và sự kiện
                          đặc biệt.
                        </span>
                      </div>
                      <div className="relative shrink-0">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={notifications.promotions}
                          onChange={(e) =>
                            setNotifications({
                              ...notifications,
                              promotions: e.target.checked,
                            })
                          }
                        />
                        <div
                          className={`block w-10 h-6 rounded-full transition-colors ${notifications.promotions ? "bg-[#1a2b4c]" : "bg-gray-300"}`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.promotions ? "transform translate-x-4" : ""}`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                    Thông báo trên trình duyệt (Push)
                  </h3>
                  <label className="flex items-center justify-between cursor-pointer group border border-gray-100 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div>
                      <span className="text-sm font-bold text-gray-800 block">
                        Cho phép hiển thị thông báo nổi
                      </span>
                      <span className="text-xs text-gray-500 mt-0.5 block">
                        Hiển thị trực tiếp trên góc màn hình khi bạn đang mở
                        trang web.
                      </span>
                    </div>
                    <div className="relative shrink-0">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={notifications.pushNotifications}
                        onChange={(e) =>
                          setNotifications({
                            ...notifications,
                            pushNotifications: e.target.checked,
                          })
                        }
                      />
                      <div
                        className={`block w-10 h-6 rounded-full transition-colors ${notifications.pushNotifications ? "bg-blue-600" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${notifications.pushNotifications ? "transform translate-x-4" : ""}`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
