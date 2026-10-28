
const PER_PAGE = 100;

// EXTRACT THE PAGINATOR FROM THE API RESPONSE
const paginatorOf = (response) =>
  response?.data?.data && !Array.isArray(response.data.data)
    ? response.data.data
    : response?.data;

// EXTRACT THE LIST FROM THE PAGINATOR
const listOf = (paginator) =>
  Array.isArray(paginator) ? paginator : paginator?.data;

// FETCH ALL PAGES SEQUENTIALLY
export async function fetchAllPages(
  getPage,
  { onProgress, isCancelled } = {}
) {
  // FETCH FIRST PAGE
  const first = paginatorOf(
    await getPage({ page: 1, per_page: PER_PAGE })
  );

  const firstList = listOf(first);
  const lastPage = Number(first?.last_page ?? 1);
  const all = [...firstList];

  onProgress?.(1, lastPage);

  // FETCH REMAINING PAGES
  for (let page = 2; page <= lastPage; page++) {
    if (isCancelled?.()) return null;

    const response = await getPage({
      page,
      per_page: PER_PAGE,
    });

    const list = listOf(paginatorOf(response));

    if (Array.isArray(list)) {
      all.push(...list);
    }

    onProgress?.(page, lastPage);
  }

  // REMOVE DUPLICATES USING USER ID
  return [...new Map(all.map((item) => [item.id, item])).values()];
}
