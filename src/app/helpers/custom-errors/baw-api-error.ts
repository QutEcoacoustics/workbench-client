/** Error thrown by API services whenever the API returns a non 2xx response */
export class BawApiError extends Error {
  public name = "BawApiError";
  public info: Record<string, string | string[]>;

  public constructor(
    public status: number,
    public _message: string,
    info?: Record<string, string | string[]>
  ) {
    super(_message);
    this.info = info || {};
  }

  /** Error message */
  public get message(): string {
    return this.formattedMessage();
  }

  /**
   * Format the error message. This is more useful for errors which contain
   * additional information
   *
   * @param newline Newline character, defaults to `", "`
   */
  public formattedMessage(newline?: string): string {
    if (Object.keys(this.info).length === 0) {
      return this._message;
    }

    let output = this._message + (newline || "[");

    Object.entries(this.info).forEach(([key, value]) => {
      switch (key) {
        case "tzinfoTz":
          output += `timezone identifier: ${value[0]}`;
          break;
        default:
          if (value instanceof Array && value.length === 1) {
            output += `${key}: ${value[0]}`;
          } else {
            output += `${key}: ${JSON.stringify(value)}`;
          }
          break;
      }

      output += newline ?? ", ";
    });

    output += newline ? "" : "]";
    return output;
  }
}

/**
 * Determine if the error is a baw api error
 *
 * @param error Error to check
 */
export function isBawApiError(error: any): error is BawApiError {
  return error instanceof BawApiError;
}

/**
 * API Service error response
 */
export interface ApiErrorDetails {
  status: number;
  message: string;
  info?: Record<string, string[]>;
}

/**
 * Determine if this is an api error detail object
 *
 * @param error Error response
 */
export function isApiErrorDetails(error: any): error is ApiErrorDetails {
  if (!error || !(error instanceof Object)) {
    return false;
  }
  const inputHasKey = (key: string): boolean =>
    Object.prototype.hasOwnProperty.call(error, key);
  return ["status", "message"].every((key) => inputHasKey(key));
}
