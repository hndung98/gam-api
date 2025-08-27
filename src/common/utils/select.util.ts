/**
 * Omits some properties of an object
 * @param obj
 * @param keys
 * @returns
 */
export const exclude = <T, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};
