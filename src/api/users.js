
import axiosClient from "./AxiosClient";

const USERS_ENDPOINT = "/users";

// Get all users
export const getUsers = (params) =>axiosClient.get(USERS_ENDPOINT,{params});

// Get user activity
export const getUserActivity = () =>axiosClient.get("/userActivity");

// Get a specific user
export const getUserById = (userId) =>axiosClient.get(`${USERS_ENDPOINT}/${userId}`);

// Update user details
export const updateUser = (userId, userData) =>axiosClient.patch(`${USERS_ENDPOINT}/update/${userId}`,userData);

// Suspend a user
export const suspendUser = (userId) =>axiosClient.patch(`${USERS_ENDPOINT}/suspend/${userId}`);

// Promote a user to admin
export const promoteUserToAdmin = (userId) =>axiosClient.patch(`${USERS_ENDPOINT}/create_admin/${userId}`);

// Demote an admin
export const demoteAdmin = (userId) =>axiosClient.patch(`${USERS_ENDPOINT}/demote_admin/${userId}`);

// Unsuspend a user
export const unsuspendUser = (userId) =>axiosClient.patch(`${USERS_ENDPOINT}/unsuspend/${userId}`);
