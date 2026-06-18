import api from "./api";
import axios from "axios";

// --- Get JWT Token ---
export async function getToken() {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/jwt-auth/v1/token`,
      {
        username: "admin",
        password: "admin",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.data.token;
  } catch (err) {
    console.error(
      "JWT Token Error:",
      err.response?.data || err.message
    );
    throw err;
  }
}

async getAll() {
  const res = await api.get("/wp/v2/product", {
    params: {
      _embed: true,
      per_page: 100,
    },
  });

  return res.data;
},
