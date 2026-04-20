import axiosClient from "./axiosClient";

const questionApi = {
  createQuestion: (payload) => axiosClient.post("/questions", payload),
  searchQuestions: (payload) => axiosClient.post("/questions/search", payload),
  deleteQuestion: (questionId) => axiosClient.delete(`/questions/${questionId}`),
};

export default questionApi;
