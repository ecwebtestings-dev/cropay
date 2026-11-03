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

// EXTRACT THE USER 
const extractUser = (response) =>
  response.data?.user ??
  response.data?.data?.user ??
  response.data?.data ??
  response.data;


// EXTRACT TOKEN RETURNED
const extractToken = (data) =>
  data?.token?.plainTextToken ??
  (typeof data?.token === "string" ? data.token : null) ??
  data?.access_token ??
  data?.plainTextToken;


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  // RESET ANY PREVIOUS SESSION EXPIRATION STATE.
  const resetSessionExpired = useCallback(() => {
    setSessionExpired(false);
    window.__cropPaySessionExpired = false;
  }, []);


  // UPDATE THE CURRENT USER AND PERSIST THE CHANGES.
  const updateUser = useCallback((updatedUser) => {
    if (!updatedUser || typeof updatedUser !== "object") {
      return;
    }

    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const nextUser = {...currentUser,...updatedUser,};
      saveUser(nextUser);
      return nextUser;
    });
  }, []);



  // LISTEN FOR SESSION EXPIRATION REPORTED BY AXIOS
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



  // VERIFY THE SAVED SESSION ON STARTS
  useEffect(() => {
    let active = true;

    const initializeAuth = async () => {
      try {
        const token = getToken();
        if (!token) return;
        const response = await getMe();
        const userData = extractUser(response);
        if (!active) return;
        if (!userData || !userData.role) {
          clearSession();
          setUser(null);
          return;
        }

        saveUser(userData);
        setUser(userData);
      } catch (error) {
        if (!active) return;

        // CLEAR AN INVALID OR EXPIRED SAVED SESSION.
        clearSession();
        setUser(null);
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



  // VERIFY A NEW TOKEN AND AUTHENTICATE THE USER.
  const loginWithToken = useCallback(
    async (token, remember = false) => {
      if (typeof token !== "string" || !token) {
        throw new Error("The API did not return an authentication token.");
      }

      // RESET ANY PREVIOUS SESSION EXPIRATION STATE.
      resetSessionExpired();

      // SAVE THE NEW TOKEN BEFORE VERIFYING THE USER.
      saveToken(token, remember);

      try {
        const response = await getMe();
        const userData = extractUser(response);

        if (!userData || !userData.role) {
          throw new Error("The API did not return a valid user profile.");
        }

        // SAVE THE AUTHENTICATED USER.
        saveUser(userData);
        setUser(userData);

        return userData;
      } catch (error) {
        // CLEAR THE INVALID LOGIN SESSION.
        clearSession();
        setUser(null);

        throw error;
      }
    },
    [resetSessionExpired],
  );


  // LOG IN THE USER.
  const login = useCallback(
    async (credentials, remember = false) => {
      resetSessionExpired();
      const response = await loginApi(credentials);
      const data = response.data?.data ?? response.data;
      const token = extractToken(data);

      if (typeof token !== "string" || !token) {
        throw new Error("The API did not return an authentication token.");
      }

      return loginWithToken(token, remember);
    },
    [loginWithToken, resetSessionExpired],
  );


  // REGISTER A NEW USER.
  const register = useCallback(
    async (userData, remember = true) => {
      resetSessionExpired();
      const response = await registerApi(userData);
      const data = response.data?.data ?? response.data;
      const token = extractToken(data);
      if (!token) {
        throw new Error("No authentication token. Please log in.");
      }
      return loginWithToken(token, remember);
    },
    [loginWithToken, resetSessionExpired],
  );


  // LOG OUT THE CURRENT USER.
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


  const dismissSessionTimeout = useCallback(() => {
    setSessionExpired(false);
  }, []);



  // EXPOSE AUTHENTICATION FUNCTIONS AND USER STATE.
  const value = useMemo(() => ({
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

// CUSTOM AUTHENTICATION HOOK.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Use Auth is Outside the Provider");
  }

  return context;
}
