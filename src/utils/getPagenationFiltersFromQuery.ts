export default function getPaginationFiltersFromQuery(query: any) {
  const page = query?.page ? query?.page : 0;
  const perPage = query?.perPage ? Number(query?.perPage) : 5;

  delete query?.page;
  delete query?.perPage;
  console.log("query:", query);
  return { pagination: { page, perPage }, filters: query };
}
