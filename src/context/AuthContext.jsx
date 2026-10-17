
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

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // Verify the saved session when the app starts.
  useEffect(() => {
    let cancelled = false;

    async function initializeAuth() {
      try {
        if (!getToken()) return;

        const response = await getMe();
        const userData = response.data?.user ?? response.data?.data ?? response.data;

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



  const login = useCallback(async (credentials, remember = false) => {
    const response = await loginApi(credentials);
    const data = response.data?.data ?? response.data;

    const token =
      data?.token ??
      data?.access_token ??
      data?.plainTextToken;

    if (!token) {
      throw new Error("The API did not return an authentication token.");
    }

    saveToken(token, remember);

    try {
      const meResponse = await getMe();
      const userData =
        meResponse.data?.user ??
        meResponse.data?.data ??
        meResponse.data;

      saveUser(userData);
      setUser(userData);

      return userData;
    } catch (error) {
      clearSession();
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    const response = await registerApi(userData);
    const data = response.data?.data ?? response.data;

    // If registration signs the user in, use its token.
    const token =
      data?.token ??
      data?.access_token ??
      data?.plainTextToken;

    if (token) {
      saveToken(token, false);

      const meResponse = await getMe();
      const registeredUser =
        meResponse.data?.user ??
        meResponse.data?.data ??
        meResponse.data;

      saveUser(registeredUser);
      setUser(registeredUser);

      return registeredUser;
    }

    // If registration does not sign the user in,
    // the user should proceed to the login page.
    return null;
  }, []);


  //LOGOUT USER

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
      register,
      logout,
    }),
    [user, initializing, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
