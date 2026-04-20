import axiosClient from "./axiosClient";

const quizApi = {
  createQuiz: (payload) => axiosClient.post("/quizzes", payload),
  getQuizById: async (quizId) => {
    try {
      return await axiosClient.get(`/quiz/${quizId}`);
    } catch (error) {
      if (error?.response?.status === 404) {
        return axiosClient.get(`/quizzes/${quizId}`);
      }

      throw error;
    }
  },
  submitQuizAttempt: (payload) => axiosClient.post("/quiz/submit", payload),
  deleteQuiz: (quizId) => axiosClient.delete(`/quiz/${quizId}`),
  generateAiQuiz: (payload) => axiosClient.post("/ai/quiz/generate", payload),
};

export default quizApi;
