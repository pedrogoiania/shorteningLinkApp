import axios from "axios";

const defaultTimeout = 10000;

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SHORTENER_SERVICE_BASE_URL,
  timeout: defaultTimeout,
});
