import axios from "axios";

/**
 * Extracts a human-readable error message from any error.
 * Handles Axios errors, plain Error objects, and unknown shapes.
 */
export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string => {
  if (axios.isAxiosError(error)) {
    const serverMessage = error.response?.data?.message;
    if (serverMessage && typeof serverMessage === "string") return serverMessage;
    if (error.message) return error.message;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallback;
};
