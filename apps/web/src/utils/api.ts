import axios from "axios";

export const API_BASE_URL = "";

export const api = axios.create({
  baseURL: "/api",
});
