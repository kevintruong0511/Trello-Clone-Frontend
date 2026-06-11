import { api, renewAccessToken } from "./api";
import { store } from "../redux/store";
import { clearAuth, setCredentials, setUser } from "../redux/authSlice";
import type { AuthUser } from "../types/auth";

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  store.dispatch(
    setCredentials({ accessToken: res.data.accessToken, user: res.data.user }),
  );
};

export const register = async (name: string, email: string, password: string) => {
  const res = await api.post("/auth/register", { name, email, password });
  store.dispatch(
    setCredentials({ accessToken: res.data.accessToken, user: res.data.user }),
  );
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    store.dispatch(clearAuth());
  }
};

/** Restore session on app load via refresh cookie. */
export const bootstrapSession = async () => {
  try {
    await renewAccessToken();
    const me = await api.get<AuthUser>("/me");
    store.dispatch(setUser(me.data));
    store.dispatch(
      setCredentials({ accessToken: store.getState().auth.accessToken!, user: me.data }),
    );
  } catch {
    store.dispatch(clearAuth());
  }
};
