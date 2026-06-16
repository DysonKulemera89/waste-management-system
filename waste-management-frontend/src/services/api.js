import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

//Attach token to requests (except login/register)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token && !req.url.includes("login") && !req.url.includes("register")) {
    req.headers.Authorization = `Token ${token}`;
  }

  return req;
});

export default API;