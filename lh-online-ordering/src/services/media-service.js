import api from "./api";

export const mediaService = {
  async getById(id) {
    const res = await api.get(`/wp/v2/media/${id}`);
    return res.data;
  },
};
