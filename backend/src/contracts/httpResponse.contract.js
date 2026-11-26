export const createHttpResponse = (msg, code, data = null) => {
  return {
    msg,
    code,
    data,
  };
};