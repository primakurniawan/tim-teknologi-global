import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getInventory = (params) => api.get("/inventory", { params });
export const getInsights = () => api.get("/inventory/insights");
export const getFilterOptions = () => api.get("/inventory/filter-options");
export const uploadInventoryCsv = (formData) =>
  api.post("/inventory/import", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export default api;