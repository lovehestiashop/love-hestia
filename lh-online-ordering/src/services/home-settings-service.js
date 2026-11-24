
import api from "./api";

let cachedSettings = null;

export const homeSettingsService = {
  async getSettings() {
    if (cachedSettings) {
      return cachedSettings;
    }

    const res = await api.get(
      "/pages/4973?acf_format=standard&_fields=acf"
    );

    cachedSettings = res.data.acf || {};

    return cachedSettings;
  },
};
