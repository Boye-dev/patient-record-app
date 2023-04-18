import axios from "axios";

export default axios.create({
  baseURL: "https://patient-record-app-production.up.railway.app",
  // baseURL: "http://localhost:4000",
  withCredentials: true,
  credentials: "include",
});
