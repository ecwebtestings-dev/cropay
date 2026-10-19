
import axiosClient from "./AxiosClient";

const LOGS_ENDPOINT = "/logs";

// Get all logs
export const getLogs = () =>axiosClient.get(LOGS_ENDPOINT);

// Delete logs
export const deleteAllLogs = () =>axiosClient.delete(LOGS_ENDPOINT);

// Delete 
export const deleteLog = (logId) =>axiosClient.delete(`${LOGS_ENDPOINT}/${logId}`);

// Archive 
export const archiveLog = (logId) =>axiosClient.patch(`${LOGS_ENDPOINT}/${logId}/archive`);
