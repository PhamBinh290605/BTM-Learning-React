import axiosClient from "./axiosClient";

const lessonApi = {
  createLesson: (payload) => axiosClient.post("/lessons", payload),
  updateLesson: (lessonId, payload) =>
    axiosClient.put(`/lessons/${lessonId}`, payload),
  deleteLesson: (lessonId) => axiosClient.delete(`/lessons/${lessonId}`),
  getLessonsBySectionId: (sectionId) =>
    axiosClient.get(`/sections/${sectionId}`),
  getOrCreateProgress: (lessonId) =>
    axiosClient.get(`/progress/lesson/${lessonId}`),
  updateProgress: (payload) =>
    axiosClient.post("/lesson/update-progress", payload),
  getCourseProgress: (courseId) =>
    axiosClient.get(`/courses/progress/${courseId}`),
};

export default lessonApi;
