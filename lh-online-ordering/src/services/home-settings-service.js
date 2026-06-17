import api from "./api";

let cachedSettings = null;

export const homeSettingsService = {
  async getSettings() {
    if (cachedSettings) {
      return cachedSettings;
    }

    const res = await api.get(
      "/wp/v2/pages/4973?_fields=acf"
    );

    cachedSettings = res.data.acf;

    return cachedSettings;
  },
};
