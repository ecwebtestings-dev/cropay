
import { DEMO_USER, DEMO_PASSWORD } from "../mockups/Users";

const SESSION_KEY = "croppay_mock_user";

// Read the current mock session.
function getCurrentUser() {
  try {
    const storedUser = sessionStorage.getItem(SESSION_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

// Store only the mock user's profile, not their password.
function saveSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Mock login.
async function login(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail !== DEMO_USER.email ||
    password !== DEMO_PASSWORD
  ) {
    throw new Error(
      "Invalid email or password"
    );
  }

  saveSession(DEMO_USER);
  return DEMO_USER;
}

// Mock registration.
async function register({ name, email, phone }) {
  const user = {
    id: `mock-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    role: "farmer",
  };

  // Simulate a successful registration and sign-in.
  // The password is deliberately not stored.
  saveSession(user);

  return user;
}

// Mock logout.
async function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

const authService = {
  login,
  register,
  logout,
  getCurrentUser,
};

export default authService;