/**
 * Retrieves the JWT token from localStorage.
 * @returns {string} - The JWT token or an empty string if not found.
 */
export const getTokenFromLocalStorage = (): string => {
    const localStorageData = JSON.parse(localStorage?.getItem("user") || "{}");
    return localStorageData?.JWTToken || "";
  };