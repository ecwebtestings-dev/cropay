// import api from "./api";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// Number of unread notifications for the signed-in user.
export async function getUnreadCount() {
  // TODO (real API): replace the mock below with
  //   const { data } = await api.get("/notifications/unread-count");
  //   return data.count;   // adjust to whatever field your backend returns
  await delay();
  return 2;
}