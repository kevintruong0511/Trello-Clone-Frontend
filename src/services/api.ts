import axios from "axios";
import { store } from "../redux/store";
import { clearAuth, setAccessToken } from "../redux/authSlice";

export const api = axios.create({ baseURL: "/api", withCredentials: true });

api.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let renewPromise: Promise<string> | null = null;

const renewAccessToken = (): Promise<string> => {
  if (!renewPromise) {
    renewPromise = axios
      .post("/api/auth/renew", null, { withCredentials: true })
      .then((res) => {
        const token = res.data.accessToken as string;
        store.dispatch(setAccessToken(token));
        return token;
      })
      .finally(() => {
        renewPromise = null;
      });
  }
  return renewPromise;
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    if (status === 401 && !original._retried && !original.url?.includes("/auth/")) {
      original._retried = true;
      try {
        const token = await renewAccessToken();
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch {
        store.dispatch(clearAuth());
      }
    }
    return Promise.reject(error);
  },
);

export { renewAccessToken };
