import axiosClient from "./axiosClient";

const toInt = (value, fallback) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 ? parsed : fallback;
};

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
  searchEnrollments: (payload = {}) => {
    const normalizedPayload = {
      pageNo: toInt(payload.pageNo ?? payload.page, 0),
      pageSize: toInt(payload.pageSize ?? payload.size, 10),
    };

    if (payload.userId != null) {
      normalizedPayload.userId = payload.userId;
    }

    if (payload.courseId != null) {
      normalizedPayload.courseId = payload.courseId;
    }

    if (payload.status) {
      normalizedPayload.status = payload.status;
    }

    return axiosClient.post("/search/enrollment", normalizedPayload);
  },
};

export default enrollmentApi;