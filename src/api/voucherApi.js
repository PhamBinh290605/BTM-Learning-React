import axiosClient from "./axiosClient";

const voucherApi = {
  applyVoucher: ({ code, courseId }) =>
    axiosClient.get("/vouchers/apply", {
      params: { code, courseId },
    }),
  createVoucher: (payload) => axiosClient.post("/vouchers", payload),
  updateVoucher: (id, payload) => axiosClient.put(`/vouchers/${id}`, payload),
  deleteVoucher: (id) => axiosClient.delete(`/vouchers/${id}`),
};

export default voucherApi;
