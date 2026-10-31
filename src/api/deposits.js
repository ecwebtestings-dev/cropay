import axiosClient from "./AxiosClient"; 

const DEPOSITS_ENDPOINT = "/deposits";

// Farmer
export const getDeposits = (params) => axiosClient.get(DEPOSITS_ENDPOINT, { params });

// Make deposit towards an account
export const createDeposit = (goalId, depositData) => axiosClient.post(`${DEPOSITS_ENDPOINT}/${goalId}`, depositData);

// Admin
export const getAdminDeposits = (page = 1) =>axiosClient.get(`/deposits/admin?page=${page}`);