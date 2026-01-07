import axios from "axios";
import { baseUrl } from "./base.url";

export const authInstance = axios.create({
  baseURL: `${baseUrl}/api/auth`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
