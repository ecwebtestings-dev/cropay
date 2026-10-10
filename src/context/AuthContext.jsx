
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

import authService from "../services/authServices";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    authService.getCurrentUser()
  );

  const login = useCallback(async (email, password) => {
    const authenticatedUser = await authService.login(
      email,
      password
    );

    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const register = useCallback(async (formData) => {
    const registeredUser = await authService.register(formData);

    setUser(registeredUser);
    return registeredUser;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
  };

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