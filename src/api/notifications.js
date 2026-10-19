
import axiosClient from "./AxiosClient";

const NOTIFICATIONS_ENDPOINT = "/notifications";

// Get notifications
export const getNotifications = () =>axiosClient.get(NOTIFICATIONS_ENDPOINT);
// Mark notifications as read
export const markNotificationsAsRead = (notificationData) =>axiosClient.post(`${NOTIFICATIONS_ENDPOINT}/markAsRead`,notificationData);
// Delete a notification
export const deleteNotification = (notificationId) =>axiosClient.delete(`${NOTIFICATIONS_ENDPOINT}/${notificationId}`);
