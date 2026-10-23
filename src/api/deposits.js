import axiosClient from "./AxiosClient"; // adjust to your path

const DEPOSITS_ENDPOINT = "/deposits";

// Get deposits
export const getDeposits = () => axiosClient.get(DEPOSITS_ENDPOINT);

// Make deposit towards an account
export const createDeposit = (goalId, depositData) => axiosClient.post(`${DEPOSITS_ENDPOINT}/${goalId}`, depositData);