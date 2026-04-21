import axiosClient from "./axiosClient";

const questionApi = {
  createQuestion: (payload) => axiosClient.post("/questions", payload),
  updateQuestion: (questionId, payload) => axiosClient.put(`/questions/${questionId}`, payload),
  searchQuestions: (payload) => axiosClient.post("/questions/search", payload),
  deleteQuestion: (questionId) => axiosClient.delete(`/questions/${questionId}`),
};

export default questionApi;
