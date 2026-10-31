
// EXTRACT TRANSACTIONS FROM API RESPONSES.
function extractTransactions(response) {
  const body = response?.data ?? response;

  // HANDLE FARMER DEPOSITS RESPONSE.
  if (Array.isArray(body?.user_deposits)) {
    return {
      transactions: body.user_deposits,
      lastPage: 1,
    };
  }

  // HANDLE DIRECT ARRAY RESPONSE.
  if (Array.isArray(body)) {
    return {
      transactions: body,
      lastPage: 1,
    };
  }

  // HANDLE PAGINATED RESPONSE.
  if (Array.isArray(body?.data)) {
    return {
      transactions: body.data,
      lastPage: Number(body.last_page) || 1,
    };
  }

  // HANDLE AN ADDITIONAL DATA WRAPPER.
  if (body?.data && typeof body.data === "object") {
    return extractTransactions({ data: body.data });
  }

  throw new Error("Invalid");
}

// FETCH ALL TRANSACTIONS.
export async function fetchAllTransactions(
  getTransactions,
  options = {},
) {
  const {
    isCancelled = () => false,
    onProgress,
  } = options;

  let allTransactions = [];
  let currentPage = 1;
  let lastPage = 1;

  do {
    if (isCancelled()) return [];

    const response = await getTransactions({
      page: currentPage,
    });

    if (isCancelled()) return [];

    const result = extractTransactions(response);

    allTransactions.push(...result.transactions);

    lastPage = result.lastPage;

    onProgress?.(currentPage, lastPage);

    currentPage++;
  } while (currentPage <= lastPage);

  return allTransactions;
}
