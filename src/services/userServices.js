import apiClient from "../api/AxiosClient";

const UserEndpoints = {
  users: "/users",
  activity: "/userActivity",
  user: (id) => `/users/${id}`,
  update: (id) => `/users/update/${id}`,
  suspend: (id) => `/users/suspend/${id}`,
  createAdmin: (id) => `/users/create_admin/${id}`,
  demoteAdmin: (id) => `/users/demote_admin/${id}`,
  unsuspend: (id) => `/users/unsuspend/${id}`,
};

export const getUsers = () =>
  apiClient.get(UserEndpoints.users);

export const getUserActivity = () =>
  apiClient.get(UserEndpoints.activity);

export const getUser = (id) =>
  apiClient.get(UserEndpoints.user(id));

export const updateUser = (id, data) =>
  apiClient.patch(UserEndpoints.update(id), data);

export const suspendUser = (id) =>
  apiClient.patch(UserEndpoints.suspend(id));

export const createAdmin = (id) =>
  apiClient.patch(UserEndpoints.createAdmin(id));

export const demoteAdmin = (id) =>
  apiClient.patch(UserEndpoints.demoteAdmin(id));

export const unsuspendUser = (id) =>
  apiClient.patch(UserEndpoints.unsuspend(id));