import axiosClient from "./AxiosClient";

const AuthEndPoints = {
  Register: "/register",
  Login: "/login",
  Logout: "/logout",
  GetMe: "/getMe",
  Forgot_Password: "/forgot-password",
  Reset_Password: "/resetPassword",
  Change_Password: "/password",
  GoogleLogin: "/oauth/google",
  Resend_Verification: "/email/verification-notification",

};

// Register
export const register = (userData) =>
  axiosClient.post(AuthEndPoints.Register, userData);

// Login
export const login = (credentials) =>
  axiosClient.post(AuthEndPoints.Login, credentials);

// Logout
export const logout = () =>
  axiosClient.post(AuthEndPoints.Logout);

// Get authenticated user
export const getMe = () =>
  axiosClient.get(AuthEndPoints.GetMe);

// Request password reset link
export const forgotPassword = (email) => 
  axiosClient.post(AuthEndPoints.Forgot_Password, { 
    email: email.trim().toLowerCase(),
  });

// Reset password using token and other required fields
export const resetPassword = ({ token, password, confirmPassword }) =>
  axiosClient.post(AuthEndPoints.Reset_Password, {
    token,
    password,
    password_confirmation: confirmPassword,
  });

// Change password for authenticated user
export const changePassword = (passwordData) =>
  axiosClient.patch(AuthEndPoints.Change_Password, passwordData);

// Start Google OAuth redirect
export const StartGoogleLogin = () => {
  const baseURL = axiosClient.defaults.baseURL;

  if (!baseURL) {
    throw new Error(" URL is not configured.");
  }

  const normalizedBaseURL = baseURL.replace(/\/+$/, "");

  window.location.assign(
    `${normalizedBaseURL}${AuthEndPoints.GoogleLogin}`
  );
};


//RESEND EMAIL VERIFICATIO LINL
export const resendEmailVerification =()=>{
  axiosClient.post(AuthEndPoints.Resend_Verification)
}