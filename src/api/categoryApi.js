import axiosClient from "./axiosClient";

const categoryApi = {
  getCategories: () => axiosClient.get("/categories"),
  getCategoryById: (categoryId) => axiosClient.get(`/categories/${categoryId}`),
  createCategory: (payload) => axiosClient.post("/categories", payload),
  updateCategory: (categoryId, payload) =>
    axiosClient.put(`/categories/${categoryId}`, payload),
  deleteCategory: (categoryId) =>
    axiosClient.delete(`/categories/${categoryId}`),
};

export default categoryApi;
