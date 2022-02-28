import { unknownErrorCode } from "@baw-api/baw-api.service";
import { ApiErrorDetails } from "@helpers/custom-errors/baw-api-error";
import httpCodes, {
  INTERNAL_SERVER_ERROR,
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
