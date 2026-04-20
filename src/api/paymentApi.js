import axiosClient from "./axiosClient";

const paymentApi = {
  createPaymentUrl: ({ courseId, code } = {}) =>
    axiosClient.post(
      "/payments/create-url",
      null,
      {
        params: {
          courseId,
          ...(code ? { code } : {}),
        },
      },
    ),
};

export default paymentApi;