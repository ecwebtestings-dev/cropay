
import { getUsers } from "../../api/users";

const PER_PAGE = 100;

// FETCH ALL USERS ONE PAGE AT A TIME
export async function fetchUsers({ onProgress, isCancelled } = {}) {
  
  const firstResponse = await getUsers({ page: 1, per_page: PER_PAGE,});
  const firstPaginator = firstResponse.data?.data;

  if (!Array.isArray(firstPaginator?.data)) {
    throw new Error("Unexpected users API response structure.");
  }

  const allUsers = [...firstPaginator.data];
  const lastPage = Number(firstPaginator.last_page ?? 1);

  onProgress?.(1, lastPage);

  for (let page = 2; page <= lastPage; page++) {
    if (isCancelled?.()) return null;

    const response = await getUsers({ page, per_page: PER_PAGE});
    const paginator = response.data?.data;

    if (!Array.isArray(paginator?.data)) {
      throw new Error(`Invalid users response on page ${page}.`);
    }

    allUsers.push(...paginator.data);
    onProgress?.(page, lastPage);
  }

  return isCancelled?.() ? null : allUsers;
}
