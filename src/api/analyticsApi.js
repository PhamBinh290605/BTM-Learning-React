import axiosClient from "./axiosClient";

const analyticsApi = {
  getOverview: ({ months = 12, top = 5, recent = 10 } = {}) =>
    axiosClient.get("/analytics/overview", {
      params: { months, top, recent },
    }),
};

export default analyticsApi;
