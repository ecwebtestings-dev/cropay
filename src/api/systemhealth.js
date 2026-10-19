
import axiosClient from "./AxiosClient";

const HEALTH_ENDPOINTS = {
  STATUS: "/health",
  LIVE: "/health/live",
};
// health
export const checkApiHealth = () =>axiosClient.get(HEALTH_ENDPOINTS.STATUS);
// Live
export const checkApiLiveness = () =>axiosClient.get(HEALTH_ENDPOINTS.LIVE);
