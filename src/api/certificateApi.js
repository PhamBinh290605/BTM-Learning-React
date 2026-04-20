import axiosClient from "./axiosClient";

const certificateApi = {
  autoIssue: (payload) => axiosClient.post("/certificates/auto-issue", payload),
  verifyCertificate: (code) =>
    axiosClient.get("/certificates/verify", { params: { code } }),
  getAllCertificates: () => axiosClient.get("/certificates"),
};

export default certificateApi;
