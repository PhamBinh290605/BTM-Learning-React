import axiosClient from "./axiosClient";

const notificationApi = {
  getMyNotifications: () => axiosClient.get("/notifications/me"),
  getUnreadCount: () => axiosClient.get("/notifications/me/unread-count"),
  markAsRead: (notificationId) =>
    axiosClient.patch(`/notifications/${notificationId}/read`),
  broadcast: (payload) => axiosClient.post("/notifications/broadcast", payload),
  getByUser: (userId) => axiosClient.get(`/notifications/user/${userId}`),
};

export default notificationApi;
