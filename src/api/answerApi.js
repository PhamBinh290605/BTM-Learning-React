import axiosClient from "./axiosClient";

const answerApi = {
  createAnswer: (payload) => axiosClient.post("/answers", payload),
  getAllAnswers: () => axiosClient.get("/answers"),
  updateAnswer: (answerId, payload) =>
    axiosClient.put(`/answers/${answerId}`, payload),
  deleteAnswer: (answerId) => axiosClient.delete(`/answers/${answerId}`),
};

export default answerApi;
