
import { DEMO_USER, DEMO_PASSWORD } from "../../mockups/Users";

const delay = (ms = 100) => new Promise((resolve) => setTimeout(resolve, ms));

const authError = (message, status) =>
  Object.assign(new Error(message), { isAuthError: true, status, fieldErrors: {} });

export async function mockLogin(email, password) {
  await delay();

  if (email.trim().toLowerCase() !== DEMO_USER.email || password !== DEMO_PASSWORD) {
    throw authError("Invalid email or password", 401);
  }

  return { user: { ...DEMO_USER }, token: "mock-token" };
}

export async function mockRegister({ name, email, phone }) {
  await delay();

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail === DEMO_USER.email) {
    throw Object.assign(authError("This email is already registered.", 422), {
      fieldErrors: { email: "This email is already registered." },
    });
  }

  return {
    token: "mock-token",
    user: {
      id: `mock-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      phone: phone?.trim() ?? "",
      role: "farmer",
    },
  };
}