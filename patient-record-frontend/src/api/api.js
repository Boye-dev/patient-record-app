import axios from "axios";

export default axios.create({
  baseURL: "https://patient-record-app-production.up.railway.app",
  // baseURL: "https://babcock-exeat-production.up.railway.app",
  withCredentials: true,
  credentials: "include",
});
