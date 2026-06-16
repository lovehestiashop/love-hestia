import api from "./api";
import axios from "axios";

export async function getToken() {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/jwt-auth/v1/token`,
      { username: "admin", password: "admin" },
      { headers: { "Content-Type": "application/json" } },
    );
    return res.data.token;
  } catch (err) {
    console.error("JWT Token Error:", err.response?.data || err.message);
    throw err;
  }
}

export const productService = {
  async getAll() {
    const token = await getToken();
    const res = await api.get("/wp/v2/product", {
      headers: { Authorization: `Bearer ${token}` },
      params: { _embed: true, per_page: 100 },
    });
    return res.data;
  },

  // token param lets callers reuse an already-fetched token
  async updateStock(productId, newStock, token) {
    if (!productId || isNaN(productId)) {
      console.error("[updateStock] Invalid productId:", productId);
      return;
    }
    console.log("updateStock productId:", productId, "newStock:", newStock);
    const authToken = token || (await getToken());
    const formData = new FormData();
    formData.append("acf[stock]", newStock);
    const res = await api.post(
      `/wp/v2/product/${productId}`,
      formData,
      { headers: { Authorization: `Bearer ${authToken}` } },
    );
    return res.data;
  },
};
