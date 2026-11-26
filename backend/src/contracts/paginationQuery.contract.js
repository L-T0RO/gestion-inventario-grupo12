export const parsePaginationQuery = (query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, parseInt(query.limit, 10) || 10);
  const sortBy = query.sortBy || "id";
  const order = (query.order || "asc").toLowerCase() === "desc" ? "desc" : "asc";
  const search = query.search || "";

  return { page, limit, sortBy, order, search };
};