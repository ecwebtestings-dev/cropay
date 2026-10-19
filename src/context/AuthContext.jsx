
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

// Accept different API response shapes
const extractUser = (response) =>
  response.data?.user ??
  response.data?.data ??
  response.data;

// Extract the plain-text token returned by Laravel
const extractToken = (data) =>
  data?.token?.plainTextToken ??
  (typeof data?.token === "string" ? data.token : null) ??
  data?.access_token ??
  data?.plainTextToken;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify the saved session when the app starts
  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        const token = getToken();

        if (!token) {
          return;
        }

        const userData = extractUser(await getMe());

        if (active) {
          if (!userData || !userData.role) {
            clearSession();
            setUser(null);
            return;
          }

          saveUser(userData);
          setUser(userData);
        }
      } catch (error) {
        if (active) {
          clearSession();
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      active = false;
    };
  }, []);

  // Used by login and Google sign-in
  const loginWithToken = useCallback(
    async (token, remember = false) => {
      if (typeof token !== "string" || !token) {
        throw new Error(
          "The API did not return an authentication token."
        );
      }

      saveToken(token, remember);

      try {
        const userData = extractUser(await getMe());

        if (!userData || !userData.role) {
          throw new Error(
            "The API did not return a valid user profile."
          );
        }

        saveUser(userData);
        setUser(userData);

        return userData;
      } catch (error) {
        clearSession();
        setUser(null);
        throw error;
      }
    },
    []
  );

  // Login
  const login = useCallback(
    async (credentials, remember = false) => {
      const response = await loginApi(credentials);
      const data = response.data?.data ?? response.data;
      const token = extractToken(data);

      if (typeof token !== "string" || !token) {
        throw new Error(
          "The API did not return an authentication token."
        );
      }

      return loginWithToken(token, remember);
    },
    [loginWithToken]
  );

  // Registration does not automatically sign the user in
  const register = useCallback(async (userData) => {
    await registerApi(userData);
    return null;
  }, []);

  // Logout
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
      loading,
      initializing: loading,
      isAuthenticated: Boolean(user),
      login,
      loginWithToken,
      register,
      logout,
    }),
    [user, loading, login, loginWithToken, register, logout]
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
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}
