import api from "./api";
import axios from "axios";

// JWT token function needed by order-service.js
export async function getToken() {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/jwt-auth/v1/token`,
    {
      username: "Loraine", 
      password: "*Ivi@Q!dpx#Okhxu#)(G6mFv",
    }
  );

  return res.data.token;
}

export const productService = {
  async getAll() {
    const res = await api.get("/wp/v2/product", {
      params: {
        _embed: true,
        per_page: 100,
      },
    });

    return res.data;
  },

  async getById(id) {
    const res = await api.get(`/wp/v2/product/${id}`, {
      params: {
        _embed: true,
      },
    });

    return res.data;
  },
};
