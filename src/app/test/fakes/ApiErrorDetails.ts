import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ApiResponse, unknownErrorCode } from "@baw-api/baw-api.service";
import httpCodes from "http-status";

// TODO Replace this with http-status numbers instead of string typing
type HTTPStatus =
  | "Unauthorized"
  | "Not Found"
  | "Bad Request"
  | "Unprocessable Entity"
  | "Internal Server Error"
  | "Custom";

/**
 * Used to generate a well constructed error object after the interceptor
 * has intercepted and converted the API response
 *
 * @param type Http status type
 * @param custom Custom error details
 */
export function generateApiErrorDetails(
  type: HTTPStatus = "Unauthorized",
  custom?: Partial<ApiErrorDetails>
): ApiErrorDetails {
  let status: number;
  let message: string;

  switch (type) {
    case "Unauthorized":
      status = httpCodes.UNAUTHORIZED;
      message = type;
      break;
    case "Not Found":
      status = httpCodes.NOT_FOUND;
      message = type;
      break;
    case "Bad Request":
      status = httpCodes.BAD_REQUEST;
      message = type;
      break;
    case "Unprocessable Entity":
      status = httpCodes.UNPROCESSABLE_ENTITY;
      message = "Record could not be saved";
      break;
    case "Internal Server Error":
      status = httpCodes.INTERNAL_SERVER_ERROR;
      message = "Internal Server Failure";
      break;
  }

  return {
    status: custom?.status ?? status ?? unknownErrorCode,
    message: custom?.message ?? message ?? "Unknown",
    info: custom?.info ?? undefined,
  };
}

/**
 * Used to generate a well constructed error object for API responses
 * that do not conform to the standard
 *
 * @param type Http status type
 * @param custom Custom error details
 */
export function generateApiErrorResponse(
  type: HTTPStatus = "Unauthorized",
  custom?: Partial<ApiErrorDetails>
): ApiResponse<null> {
  const details = generateApiErrorDetails(type, custom);

  return {
    meta: {
      status: details.status,
      message: type,
      error: {
        details: custom?.message ?? details.message,
        info: custom?.info,
      },
    },
    data: null,
  };
}
