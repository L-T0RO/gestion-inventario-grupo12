export const ROLES = {
  ADMIN: 'ADMINISTRADOR',
  OPERARIO: 'OPERARIO',
  VENDEDOR: 'VENDEDOR',
};

export function createApiResponse({ msg = 'Ok', code = 200, data = null } = {}) {
  return {
    msg,
    code,
    data,
  };
}

export function createPaginatedPayload({
  items = [],
  total = 0,
  page = 1,
  limit = 10,
} = {}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    items,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
}