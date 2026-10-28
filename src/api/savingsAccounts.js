import axiosClient from './AxiosClient'

const SAVINGS_ACCOUNT_ENDPOINT ="/saving_goals";

//GET SAVINGS GOALS
export const getSavingsAccount =()=>axiosClient.get(SAVINGS_ACCOUNT_ENDPOINT);

//CREATE A SAVINGS ACCOUNT
export const createSavingsAccount =(AccountData)=>axiosClient.post(SAVINGS_ACCOUNT_ENDPOINT,AccountData);

//UPDATE SAVINGS ACCOUNT
export const updateSavingsAccount=(AccountID,AccountData)=>axiosClient.patch(`${SAVINGS_ACCOUNT_ENDPOINT}/${AccountID}`,AccountData);

// SAVINGS GOALS FOR ADMIN
export const getAdminSavingGoals = (params = {}) =>axiosClient.get("/saving_goals/admin", { params });