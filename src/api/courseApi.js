import axiosClient from "./axiosClient";

const courseApi = {
  getCourses: () => axiosClient.get("/courses"),
  getCourseById: (courseId) => axiosClient.get(`/course/${courseId}`),
  createCourse: (payload) => axiosClient.post("/courses", payload),
  updateCourse: (courseId, payload) => axiosClient.put(`/course/${courseId}`, payload),
  deleteCourse: (courseId) => axiosClient.delete(`/course/${courseId}`),
  getPendingCourses: (page = 0, size = 10) =>
    axiosClient.get("/pending", { params: { page, size } }),
  approveCourse: (id) => axiosClient.patch(`/${id}/approve`),
  rejectCourse: (id) => axiosClient.patch(`/${id}/reject`),
};

export default courseApi;
