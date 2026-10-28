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

// EXTRACTS THE USER FROM DIFFERENT API RESPONSE SHAPES.
const extractUser = (response) =>
  response.data?.user ??
  response.data?.data?.user ??
  response.data?.data ??
  response.data;

// EXTRACTS THE PLAIN-TEXT TOKEN RETURNED BY LARAVEL.
const extractToken = (data) =>
  data?.token?.plainTextToken ??
  (typeof data?.token === "string" ? data.token : null) ??
  data?.access_token ??
  data?.plainTextToken;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // UPDATES THE CURRENT USER AND PERSISTS THE CHANGES.
  const updateUser = useCallback((updatedUser) => {
    if (!updatedUser || typeof updatedUser !== "object") {
      return;
    }

    setUser((currentUser) => {
      if (!currentUser) return currentUser;

      const nextUser = {
        ...currentUser,
        ...updatedUser,
      };

      saveUser(nextUser);
      return nextUser;
    });
  }, []);

  // LISTENS FOR SESSION EXPIRATION REPORTED BY AXIOS.
  useEffect(() => {
    const handleSessionExpired = () => {
      clearSession();
      setUser(null);
      setSessionExpired(true);
    };

    window.addEventListener("auth:expired", handleSessionExpired);

    return () => {
      window.removeEventListener("auth:expired", handleSessionExpired);
    };
  }, []);

  // VERIFY THE SAVED SESSION WHEN THE APP STARTS.
  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        const token = getToken();

        if (!token) return;

        const userData = extractUser(await getMe());

        if (!active) return;

        if (!userData || !userData.role) {
          clearSession();
          setUser(null);
          return;
        }

        saveUser(userData);
        setUser(userData);
      } catch {
        if (active) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      active = false;
    };
  }, []);

  // USED BY LOGIN AND GOOGLE SIGN-IN.
  const loginWithToken = useCallback(async (token, remember = false) => {
    if (typeof token !== "string" || !token) {
      throw new Error("The API did not return an authentication token.");
    }

    saveToken(token, remember);

    try {
      const userData = extractUser(await getMe());

      if (!userData || !userData.role) {
        throw new Error("The API did not return a valid user profile.");
      }

      saveUser(userData);
      setUser(userData);
      setSessionExpired(false);

      // ALLOW A FUTURE SESSION TO EXPIRE AGAIN.
      window.__cropPaySessionExpired = false;

      return userData;
    } catch (error) {
      clearSession();
      setUser(null);
      throw error;
    }
  }, []);

  // LOGS IN THE USER.
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
    [loginWithToken],
  );

  // REGISTERS THE USER.
  const register = useCallback(
    async (userData, remember = true) => {
      const response = await registerApi(userData);
      const data = response.data?.data ?? response.data;
      const token = extractToken(data);

      if (!token) {
        throw new Error("No authentication token. Please log in.");
      }

      return loginWithToken(token, remember);
    },
    [loginWithToken],
  );

  // LOGS OUT THE USER.
  const logout = useCallback(async () => {
    try {
      if (getToken()) {
        await logoutApi();
      }
    } finally {
      clearSession();
      setUser(null);
      setSessionExpired(false);
      window.__cropPaySessionExpired = false;
    }
  }, []);

  // DISMISSES THE TIMEOUT INTERFACE.
  const dismissSessionTimeout = useCallback(() => {
    setSessionExpired(false);
  }, []);

  // EXPOSES AUTHENTICATION FUNCTIONS.
  const value = useMemo(
    () => ({
      user,
      loading,
      initializing: loading,
      isAuthenticated: Boolean(user),
      sessionExpired,
      dismissSessionTimeout,
      login,
      loginWithToken,
      register,
      logout,
      updateUser,
    }),
    [
      user,
      loading,
      sessionExpired,
      dismissSessionTimeout,
      login,
      loginWithToken,
      register,
      logout,
      updateUser,
    ],
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
