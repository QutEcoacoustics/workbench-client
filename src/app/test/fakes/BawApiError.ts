import { unknownErrorCode } from "@baw-api/baw-api.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import httpCodes, { INTERNAL_SERVER_ERROR, UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "http-status";

export function generateBawApiError(
  status: number = UNAUTHORIZED,
  message?: string,
  data: any = null,
  info?: Record<string, string | string[]>,
): BawApiError<any> {
  if (!message) {
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
      default:
        message = httpCodes[status] as string;
    }
  }

  return new BawApiError(status, message, data, info);
}
