import axiosClient from "./axiosClient";

const enrollmentApi = {
  enroll: ({ courseId, price = 0, reason = "" }) =>
    axiosClient.post("/enrollments", {
      courseId,
      price,
      reason,
    }),
  getById: (enrollmentId) => axiosClient.get(`/enrollment/${enrollmentId}`),
  cancelEnroll: (enrollmentId, payload) =>
    axiosClient.post(`/enrollment/${enrollmentId}`, payload),
  reactivateEnroll: (enrollmentId) =>
    axiosClient.post(`/reactive/enroll/${enrollmentId}`),
  searchEnrollments: (payload) =>
    axiosClient.post("/search/enrollment", payload),
};

export default enrollmentApi;