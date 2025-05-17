import { ENV } from "@/constants/variables";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: ENV.AUTH_APP_DOMAIN,
  headers: {
    "Content-Type": "application/json",
  },
});
