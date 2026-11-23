
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

  // Get occasion terms from the WordPress REST API.
  async getOccasions() {
    const res = await api.get("/wp/v2/occasions", {
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
