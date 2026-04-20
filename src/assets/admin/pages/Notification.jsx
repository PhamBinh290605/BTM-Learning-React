import { useEffect, useMemo, useState } from "react";
import notificationApi from "../../../api/notificationApi";
import { getStoredRole } from "../../../utils/session";

const TARGET_TO_ROLE = {
  all: null,
  students: "STUDENT",
  instructors: "INSTRUCTOR",
};

const TYPE_TO_STYLE = {
  SYSTEM: {
    wrapper: "bg-blue-100 text-blue-600",
    icon: (
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    ),
  },
  ENROLLMENT_CONFIRMED: {
    wrapper: "bg-green-100 text-green-600",
    icon: (
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    ),
  },
  CERTIFICATE_ISSUED: {
    wrapper: "bg-purple-100 text-purple-600",
    icon: <path d="M5 3a2 2 0 00-2 2v3a2 2 0 002 2h1l1 7 3-2 3 2 1-7h1a2 2 0 002-2V5a2 2 0 00-2-2H5z" />,
  },
  REVIEW_RECEIVED: {
    wrapper: "bg-amber-100 text-amber-600",
    icon: <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />,
  },
};

const formatDateTime = (value) => {
  if (!value) return "--";
  return new Date(value).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const NotificationManagement = () => {
  const role = getStoredRole();
  const isAdmin = role === "ADMIN";

  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [readFilter, setReadFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);

  const [composeData, setComposeData] = useState({
    title: "",
    content: "",
    target: "all",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [notificationsResponse, unreadResponse] = await Promise.all([
        notificationApi.getMyNotifications(),
        notificationApi.getUnreadCount(),
      ]);

      setNotifications(notificationsResponse?.data?.result || []);
      setUnreadCount(unreadResponse?.data?.result || 0);
    } catch (fetchError) {
      console.error("Failed to load notifications:", fetchError?.response?.data || fetchError);
      setError(fetchError?.response?.data?.message || "Không thể tải thông báo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const keyword = searchTerm.trim().toLowerCase();
      const matchKeyword =
        keyword.length === 0 ||
        notification.title?.toLowerCase().includes(keyword) ||
        notification.message?.toLowerCase().includes(keyword);

      const matchRead =
        readFilter === "all" ||
        (readFilter === "read" && notification.isRead) ||
        (readFilter === "unread" && !notification.isRead);

      return matchKeyword && matchRead;
    });
  }, [notifications, searchTerm, readFilter]);

  const handleSendBroadcast = async (event) => {
    event.preventDefault();
    if (!composeData.title.trim() || !composeData.content.trim()) {
      alert("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    try {
      setSending(true);

      const payload = {
        role: TARGET_TO_ROLE[composeData.target],
        title: composeData.title.trim(),
        message: composeData.content.trim(),
        type: "SYSTEM",
      };

      await notificationApi.broadcast(payload);
      setComposeData({ title: "", content: "", target: "all" });
      await fetchNotifications();
      alert("Đã gửi thông báo thành công.");
    } catch (sendError) {
      console.error("Broadcast notification failed:", sendError?.response?.data || sendError);
      alert(sendError?.response?.data?.message || "Gửi thông báo thất bại");
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      await fetchNotifications();
    } catch (markError) {
      console.error("Mark notification as read failed:", markError?.response?.data || markError);
      alert(markError?.response?.data?.message || "Cập nhật trạng thái thông báo thất bại");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12 font-sans">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 px-8 py-5 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-serif">Hệ thống Thông báo</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý thông báo nội bộ và theo dõi thông báo nhận được.
          </p>
        </div>
        <div className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
          {unreadCount} chưa đọc
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-8 flex gap-8 items-start">
        <div className="flex-[6] space-y-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex justify-between items-center gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <select
              className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500 bg-white text-sm text-gray-700 font-medium"
              value={readFilter}
              onChange={(event) => setReadFilter(event.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="unread">Chưa đọc</option>
              <option value="read">Đã đọc</option>
            </select>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Thông báo của tôi</h2>
              <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2.5 py-1 rounded-full">
                {filteredNotifications.length} bản ghi
              </span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[650px] overflow-y-auto">
              {isLoading ? (
                <div className="p-10 text-center text-gray-500 text-sm">Đang tải thông báo...</div>
              ) : error ? (
                <div className="p-10 text-center text-red-600 text-sm">{error}</div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-10 text-center text-gray-500 text-sm">Không có thông báo nào phù hợp.</div>
              ) : (
                filteredNotifications.map((notification) => {
                  const style = TYPE_TO_STYLE[notification.type] || TYPE_TO_STYLE.SYSTEM;

                  return (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-gray-50 transition-colors ${notification.isRead ? "opacity-80" : ""}`}
                    >
                      <div className="flex gap-4 items-start">
                        <div className={`w-10 h-10 rounded-full ${style.wrapper} flex items-center justify-center shrink-0`}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            {style.icon}
                          </svg>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2 mb-1">
                            <h3 className="text-base font-bold text-gray-900">{notification.title}</h3>
                            <span className="text-xs text-gray-400 whitespace-nowrap">
                              {formatDateTime(notification.createdAt)}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 leading-relaxed">{notification.message}</p>

                          <div className="flex items-center gap-3 text-xs font-medium">
                            <span className={`px-2 py-0.5 rounded ${notification.isRead ? "bg-slate-100 text-slate-600" : "bg-emerald-100 text-emerald-700"}`}>
                              {notification.isRead ? "Đã đọc" : "Chưa đọc"}
                            </span>

                            {!notification.isRead && (
                              <button
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Đánh dấu đã đọc
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="flex-[4] sticky top-28">
          {isAdmin ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-[#1a2b4c] px-6 py-4">
                <h2 className="text-lg font-bold text-white">Soạn thông báo mới</h2>
              </div>

              <form onSubmit={handleSendBroadcast} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Gửi tới</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 bg-gray-50 text-sm font-medium text-gray-800"
                    value={composeData.target}
                    onChange={(event) =>
                      setComposeData((prev) => ({ ...prev, target: event.target.value }))
                    }
                  >
                    <option value="all">Toàn hệ thống</option>
                    <option value="students">Tất cả Học viên</option>
                    <option value="instructors">Tất cả Giảng viên</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Tiêu đề thông báo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập tiêu đề..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-500 text-sm text-gray-900"
                    value={composeData.title}
                    onChange={(event) =>
                      setComposeData((prev) => ({ ...prev, title: event.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows="5"
                    placeholder="Nhập nội dung thông báo..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500 text-sm text-gray-800 resize-none"
                    value={composeData.content}
                    onChange={(event) =>
                      setComposeData((prev) => ({ ...prev, content: event.target.value }))
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {sending ? "Đang gửi..." : "Gửi thông báo"}
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-blue-800 leading-relaxed">
                Tài khoản của bạn chỉ có quyền xem và đánh dấu thông báo đã đọc. Quyền gửi broadcast chỉ dành cho quản trị viên.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationManagement;
