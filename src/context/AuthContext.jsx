import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  getMe,
} from "../api/authApi";

import {
  clearSession,
  getToken,
  saveToken,
  saveUser,
} from "../utils/tokenStorage";

const AuthContext = createContext(null);

// THE API WRAPS THE USER DIFFERENTLY ACROSS ENDPOINTS: ACCEPT ALL SHAPES
const extractUser = (response) =>
  response.data?.user ?? response.data?.data ?? response.data;

// LARAVEL SENDS: token: { accessToken: {...}, plainTextToken: "40|..." }
const extractToken = (data) =>
  data?.token?.plainTextToken ??
  (typeof data?.token === "string" ? data.token : null) ??
  data?.access_token ??
  data?.plainTextToken;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // VERIFY THE SAVED SESSION WHEN THE APP STARTS
  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      try {
        if (!getToken()) return;

        const userData = extractUser(await getMe());

        if (!cancelled) {
          setUser(userData);
          saveUser(userData);
        }
      } catch (error) {
        if (error.response?.status === 401) {
          clearSession();
          if (!cancelled) setUser(null);
        }
      } finally {
        if (!cancelled) setInitializing(false);
      }
    }

    initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  // SAVE A TOKEN, THEN LOAD THE FULL USER (WITH ROLE) FROM THE API.
  // USED BY LOGIN AND BY GOOGLE SIGN-IN (/oauth/callback).
  const loginWithToken = useCallback(async (token, remember = false) => {
    if (typeof token !== "string" || !token) {
      throw new Error("The API did not return an authentication token.");
    }

    saveToken(token, remember);

    try {
      const userData = extractUser(await getMe());

      saveUser(userData);
      setUser(userData);

      return userData;
    } catch (error) {
      clearSession();
      throw error;
    }
  }, []);

  const login = useCallback(
    async (credentials, remember = false) => {
      const response = await loginApi(credentials);
      const data = response.data?.data ?? response.data;

      const token = extractToken(data);

      if (typeof token !== "string" || !token) {
        throw new Error("The API did not return an authentication token.");
      }

      return loginWithToken(token, remember);
    },
    [loginWithToken]
  );

  // REGISTERING DOES NOT SIGN THE USER IN: THEY SIGN IN AFTERWARDS
  const register = useCallback(async (userData) => {
    await registerApi(userData);
    return null;
  }, []);

  // LOGOUT USER
  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await logoutApi();
      }
    } finally {
      clearSession();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initializing,
      login,
      loginWithToken,
      register,
      logout,
    }),
    [user, initializing, login, loginWithToken, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}