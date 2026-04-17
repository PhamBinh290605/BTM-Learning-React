import React, { useState } from "react";

const NotificationManagement = () => {
  // --- 1. MOCK DATA: LỊCH SỬ THÔNG BÁO ---
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Bảo trì hệ thống định kỳ",
      content:
        "Hệ thống sẽ tạm dừng hoạt động từ 00:00 đến 04:00 sáng Chủ Nhật tuần này để nâng cấp server.",
      target: "all", // all, students, instructors
      type: "warning", // info, warning, success
      status: "sent", // sent, draft, scheduled
      date: "17/04/2026 09:00",
      readCount: 1250,
    },
    {
      id: 2,
      title: 'Ra mắt tính năng "Chứng chỉ điện tử"',
      content:
        "Chào mừng bạn đến với tính năng mới! Giờ đây bạn có thể chia sẻ trực tiếp chứng chỉ lên LinkedIn.",
      target: "students",
      type: "success",
      status: "sent",
      date: "15/04/2026 14:30",
      readCount: 3420,
    },
    {
      id: 3,
      title: "Cập nhật chính sách thanh toán cho Giảng viên",
      content:
        "Vui lòng cập nhật thông tin tài khoản ngân hàng trước ngày 30/04 để nhận đối soát tháng này.",
      target: "instructors",
      type: "info",
      status: "sent",
      date: "10/04/2026 10:15",
      readCount: 45,
    },
    {
      id: 4,
      title: "Khảo sát chất lượng khóa học Quý 1/2026",
      content:
        "Bạn vui lòng dành ra 2 phút để hoàn thành form khảo sát đính kèm nhé.",
      target: "all",
      type: "info",
      status: "draft",
      date: "Bản nháp",
      readCount: 0,
    },
  ]);

  // --- 2. STATE: FORM SOẠN THẢO ---
  const [composeData, setComposeData] = useState({
    title: "",
    content: "",
    target: "all",
    type: "info",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterTarget, setFilterTarget] = useState("all_targets");

  // --- 3. HÀM XỬ LÝ ---
  const filteredNotifications = notifications.filter((notif) => {
    const matchSearch = notif.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchTarget =
      filterTarget === "all_targets" || notif.target === filterTarget;
    return matchSearch && matchTarget;
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!composeData.title.trim() || !composeData.content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    const newNotif = {
      id: Date.now(),
      title: composeData.title,
      content: composeData.content,
      target: composeData.target,
      type: composeData.type,
      status: "sent",
      date: new Date().toLocaleString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      readCount: 0,
    };

    setNotifications([newNotif, ...notifications]);
    setComposeData({ title: "", content: "", target: "all", type: "info" });
    alert("Đã gửi thông báo thành công!");
  };

  // --- UTILS: Render UI theo loại ---
  const getTargetLabel = (target) => {
    switch (target) {
      case "all":
        return "Tất cả người dùng";
      case "students":
        return "Chỉ Học viên";
      case "instructors":
        return "Chỉ Giảng viên";
      default:
        return target;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "warning":
        return (
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      case "success":
        return (
          <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
      default: // info
        return (
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      {/* --- TOP BAR --- */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            Hệ thống Thông báo
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gửi thông báo đẩy (Push Notifications) và cập nhật hệ thống tới
            người dùng.
          </p>
        </div>
      </div>

      {/* --- MAIN CONTENT LAYOUT --- */}
      <div className="max-w-7xl mx-auto px-8 pt-8 flex gap-8 items-start">
        {/* CỘT TRÁI: LỊCH SỬ THÔNG BÁO (60%) */}
        <div className="flex-[6] space-y-6">
          {/* Toolbar Tìm kiếm */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm tiêu đề thông báo..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 bg-white text-sm text-gray-700 font-medium"
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
            >
              <option value="all_targets">Tất cả đối tượng</option>
              <option value="all">Toàn hệ thống</option>
              <option value="students">Học viên</option>
              <option value="instructors">Giảng viên</option>
            </select>
          </div>

          {/* Danh sách Thông báo */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Lịch sử gửi
              </h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
                {filteredNotifications.length} bản ghi
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[650px] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="p-10 text-center text-gray-500 text-sm">
                  Không tìm thấy thông báo nào.
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="p-6 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="flex gap-4 items-start">
                      {getTypeIcon(notif.type)}
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {notif.title}
                          </h3>
                          {notif.status === "draft" ? (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded">
                              Bản nháp
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {notif.date}
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                          {notif.content}
                        </p>

                        <div className="flex items-center gap-4 text-xs font-medium">
                          <div className="flex items-center gap-1.5 text-gray-500">
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
                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                            </svg>
                            Gửi tới:{" "}
                            <span className="text-gray-700">
                              {getTargetLabel(notif.target)}
                            </span>
                          </div>

                          {notif.status === "sent" && (
                            <div className="flex items-center gap-1.5 text-blue-600">
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
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              {notif.readCount.toLocaleString()} lượt xem
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dropdown Menu (Giả lập) */}
                      <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: FORM TẠO THÔNG BÁO MỚI (40%) */}
        <div className="flex-[4] sticky top-28">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#1a2b4c] px-6 py-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Soạn thông báo mới
              </h2>
            </div>

            <form onSubmit={handleSend} className="p-6 space-y-5">
              {/* Row 1: Đối tượng & Loại */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Gửi tới
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-gray-50 text-sm font-medium text-gray-800"
                    value={composeData.target}
                    onChange={(e) =>
                      setComposeData({ ...composeData, target: e.target.value })
                    }
                  >
                    <option value="all">Toàn hệ thống</option>
                    <option value="students">Tất cả Học viên</option>
                    <option value="instructors">Tất cả Giảng viên</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Mức độ / Loại
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-gray-50 text-sm font-medium text-gray-800"
                    value={composeData.type}
                    onChange={(e) =>
                      setComposeData({ ...composeData, type: e.target.value })
                    }
                  >
                    <option value="info">Thông tin chung</option>
                    <option value="success">Tin vui / Khuyến mãi</option>
                    <option value="warning">Cảnh báo / Bảo trì</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Tiêu đề */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Tiêu đề thông báo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề ngắn gọn..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-900 font-medium"
                  value={composeData.title}
                  onChange={(e) =>
                    setComposeData({ ...composeData, title: e.target.value })
                  }
                />
              </div>

              {/* Row 3: Nội dung */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Nội dung chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="5"
                  placeholder="Nội dung này sẽ được gửi qua Notification Bell và Email..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-gray-800 resize-none"
                  value={composeData.content}
                  onChange={(e) =>
                    setComposeData({ ...composeData, content: e.target.value })
                  }
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                  Lưu nháp
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-sm flex justify-center items-center gap-2"
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Gửi thông báo
                </button>
              </div>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 shrink-0 mt-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Lưu ý:</strong> Khi nhấn "Gửi thông báo", hệ thống sẽ tự
              động gửi Push Notification (Quả chuông) đến giao diện Web/App của
              người dùng, đồng thời gửi 1 bản sao qua Email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
