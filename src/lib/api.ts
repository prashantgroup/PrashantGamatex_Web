import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://pgplcrm.prasadsos.co:8091";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-cache",
  },
});

export default client; 