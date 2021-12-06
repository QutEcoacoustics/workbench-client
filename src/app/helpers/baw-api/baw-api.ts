import { ApiErrorDetails } from "@baw-api/api.interceptor.service";

/**
 * Determine if error response has already been processed
 *
 * @param errorResponse Error response
 */
export function isApiErrorDetails(
  errorResponse: any
): errorResponse is ApiErrorDetails {
  if (!errorResponse) {
    return false;
  }

  const keys = Object.keys(errorResponse);
  return (
    keys.length <= 3 && keys.includes("status") && keys.includes("message")
  );
}
