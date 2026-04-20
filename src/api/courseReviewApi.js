import axiosClient from "./axiosClient";

const courseReviewApi = {
  createReview: (payload) => axiosClient.post("/course-reviews", payload),
  getReviewsByCourse: (courseId) =>
    axiosClient.get(`/course-reviews/course/${courseId}`),
};

export default courseReviewApi;
