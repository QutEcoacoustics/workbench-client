import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ApiResponse, unknownErrorCode } from "@baw-api/baw-api.service";
import httpCodes, {
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  REQUEST_TIMEOUT,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
} from "http-status";

// TODO Make this is the default method for error generation
export function generateApiErrorDetailsV2(
  status: number = UNAUTHORIZED,
  custom?: Partial<ApiErrorDetails>
): ApiErrorDetails {
  let message: string;
  switch (status) {
    case UNPROCESSABLE_ENTITY:
      message = "Record could not be saved";
      break;
    case INTERNAL_SERVER_ERROR:
      message = "Internal Server Failure";
      break;
    case unknownErrorCode:
      message = "Unknown";
      break;
  }

  return {
    status: custom?.status ?? status,
    message: custom?.message ?? message ?? (httpCodes[status] as string),
    info: custom?.info ?? undefined,
  };
}

// TODO Remove
type HTTPStatus =
  | "Unauthorized"
  | "Not Found"
  | "Bad Request"
  | "Request Timeout"
  | "Unprocessable Entity"
  | "Internal Server Error"
  | "Forbidden"
  | "Custom";

/**
 * TODO Remove this function
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
      status = UNAUTHORIZED;
      message = type;
      break;
    case "Not Found":
      status = NOT_FOUND;
      message = type;
      break;
    case "Bad Request":
      status = BAD_REQUEST;
      message = type;
      break;
    case "Forbidden":
      status = FORBIDDEN;
      message = type;
      break;
    case "Request Timeout":
      status = REQUEST_TIMEOUT;
      message = type;
      break;
    case "Unprocessable Entity":
      status = UNPROCESSABLE_ENTITY;
      message = "Record could not be saved";
      break;
    case "Internal Server Error":
      status = INTERNAL_SERVER_ERROR;
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
