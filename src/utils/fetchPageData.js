
const PER_PAGE = 10;

export async function fetchPageData(getPage,page = 1,
  { perPage = PER_PAGE } = {}
) {
  const response = await getPage({ page, per_page: perPage,});

  // PAGINATOR
  const paginator = response?.data?.data;

  const users = Array.isArray(paginator?.data)
    ? paginator.data
    : [];

  return {
    data: users,
    currentPage: Number(paginator?.current_page ?? page),
    lastPage: Number(paginator?.last_page ?? 1),
    perPage: Number(paginator?.per_page ?? perPage),
    total: Number(paginator?.total ?? 0),

    // GLOBAL STATS 
    stats: response?.data?.stats ?? null,
  };
}
