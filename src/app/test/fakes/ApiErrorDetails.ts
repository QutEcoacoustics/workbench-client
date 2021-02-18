import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ApiResponse, apiReturnCodes } from "@baw-api/baw-api.service";

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
      status = apiReturnCodes.unauthorized;
      message = type;
      break;
    case "Not Found":
      status = apiReturnCodes.notFound;
      message = type;
      break;
    case "Bad Request":
      status = apiReturnCodes.badRequest;
      message = type;
      break;
    case "Unprocessable Entity":
      status = apiReturnCodes.unprocessableEntity;
      message = "Record could not be saved";
      break;
    case "Internal Server Error":
      status = apiReturnCodes.internalServerFailure;
      message = "Internal Server Failure";
      break;
  }

  return {
    status: custom?.status ?? status ?? apiReturnCodes.unknown,
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
