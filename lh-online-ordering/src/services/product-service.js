
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

  // Retrieve all available occasion terms from WordPress.
  async getOccasions() {
    const res = await api.get("/wp/v2/occasion", {
      params: {
        per_page: 100,
        hide_empty: false,
        orderby: "name",
        order: "asc",
      },
    });

    return res.data;
  },
};
