import api from "./api";

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
