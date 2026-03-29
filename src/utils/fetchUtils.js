const delay = (ms) => new Promise(res => setTimeout(res, ms));

export const fetchWithRetry = async (fn, retries = 1) => {
  try {
    return await fn();
  } catch (err) {
    if (!err.response && retries > 0) {
      await new Promise(res => setTimeout(res, 3000));
      return fetchWithRetry(fn, retries - 1);
    }
    throw err;
  }
};
