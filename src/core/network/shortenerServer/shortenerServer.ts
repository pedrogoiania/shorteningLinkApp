import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SHORTENER_SERVICE_BASE_URL,
  timeout: 10000,
});
