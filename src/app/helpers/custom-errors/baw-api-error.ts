export class BawApiError extends Error {
  public name = "BawApiError";
  public status: number;
  public info: Record<string, string>;
  private _message: string;

  public constructor(error: ApiErrorDetails);
  public constructor(
    status: number,
    message: string,
    info?: Record<string, string>
  );

  public constructor(...args: any[]) {
    super(args.length === 1 ? args[0].message : args[1]);

    this.status = args.length === 1 ? args[0].status : args[0];
    this._message = args.length === 1 ? args[0].message : args[1];
    this.info = args.length === 1 ? args[0].info : args[2] ?? {};
  }

  public get message(): string {
    return this.formattedMessage();
  }

  public formattedMessage(newline?: string): string {
    console.log(this.status, this._message, this.info);

    if (Object.keys(this.info).length > 0) {
      return (
        this._message +
        (newline ?? "[") +
        Object.entries(this.info)
          .map(([key, value]) => `${key}: ${value}`)
          .join(newline ?? " ") +
        (newline ? "" : "]")
      );
    } else {
      return this._message;
    }
  }
}

/**
 * Determine if the error is a baw api error
 *
 * @param error Error to check
 */
export function isBawApiError(error: Error): error is BawApiError {
  return error instanceof BawApiError;
}

/**
 * API Service error response
 */
export interface ApiErrorDetails {
  status: number;
  message: string;
  info?: Record<string, string>;
}

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
