import axiosClient from "./axiosClient";

const sectionApi = {
  getSectionsByCourse: (courseId) => axiosClient.get(`/courses/${courseId}/sections`),
  createSection: (payload) => axiosClient.post("/sections", payload),
  updateSection: (sectionId, payload) =>
    axiosClient.put(`/sections/${sectionId}`, payload),
  deleteSection: (sectionId) => axiosClient.delete(`/sections/${sectionId}`),
};

export default sectionApi;
