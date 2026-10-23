import { getUsers } from "../../api/users";

const PER_PAGE = 100;       // ask for bigger pages so fewer requests are needed (ignored if the API doesn't support it)
const PAUSE_BETWEEN_MS = 400; // small pause between pages so we never burst the server
const MAX_RETRIES = 3;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch ONE page. If the server answers "429 Too Many Requests", wait and try again.
async function fetchPage(page) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await getUsers({ page, per_page: PER_PAGE });
    } catch (err) {
      const tooManyRequests = err.response?.status === 429;
      if (!tooManyRequests || attempt >= MAX_RETRIES) throw err;

      // Use the server's "Retry-After" header if it sent one, otherwise wait 2s, 4s, 8s.
      const retryAfterSeconds = Number(err.response.headers?.["retry-after"]);
      await wait(retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : 2000 * 2 ** attempt);
    }
  }
}

// Loads every user, ONE PAGE AT A TIME (never several requests at once).
//   onProgress(currentPage, lastPage) is called after each page
//   isCancelled() lets the caller stop the loop (e.g. the component was closed)
// Returns the list of users, or null if it was cancelled.
export async function fetchAllUsers({ onProgress, isCancelled }) {
  const firstResponse = await fetchPage(1);
  const firstResult = firstResponse.data?.data; // your API: response.data.data is the paginator

  if (!Array.isArray(firstResult?.data)) {
    throw new Error("Users list was not found.");
  }

  const allUsers = [...firstResult.data];
  const lastPage = Number(firstResult.last_page ?? 1);
  onProgress?.(1, lastPage);

  for (let page = 2; page <= lastPage; page++) {
    if (isCancelled?.()) return null;

    await wait(PAUSE_BETWEEN_MS);
    const response = await fetchPage(page);

    const pageUsers = response.data?.data?.data;
    if (Array.isArray(pageUsers)) allUsers.push(...pageUsers);

    onProgress?.(page, lastPage);
  }

  return allUsers;
}