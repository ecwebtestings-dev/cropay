
import axiosClient from "./AxiosClient";

const SETTINGS_ENDPOINTS = {
  CHANGE_PASSWORD: "/password",
  UPDATE_USERNAME_OR_EMAIL: "/usernameOrEmail",
  DELETE_ACCOUNT: "//deleteAccount",
};

// Change password
export const changePassword = (passwordData) =>axiosClient.patch(SETTINGS_ENDPOINTS.CHANGE_PASSWORD,passwordData);
// Update username or email
export const updateUsernameOrEmail = (userData) =>axiosClient.patch(SETTINGS_ENDPOINTS.UPDATE_USERNAME_OR_EMAIL,userData);
// Delete account
export const deleteAccount = () =>axiosClient.delete(SETTINGS_ENDPOINTS.DELETE_ACCOUNT);
