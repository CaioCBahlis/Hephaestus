import axios from "axios"


export const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  timeout: 15000,
  withCredentials: true,
});

client.defaults.withCredentials = true;
client.defaults.xsrfCookieName = "csrftoken";
client.defaults.xsrfHeaderName = "X-CSRFToken";


function getCookie(name: string) {
  const m = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

//I was having problems with CSRFT tokens, and this was the first solution that worked
// It doesnt feel natural intercepting requests and manually setting the token, but it works

client.interceptors.request.use((config) => {
  const token = getCookie("csrftoken");

  if (token) {
    config.headers = config.headers ?? {};
    config.headers["X-CSRFToken"] = token;
  }
  return config;
});

