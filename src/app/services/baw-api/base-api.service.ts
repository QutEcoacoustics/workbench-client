import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails } from "./api.interceptor";

export const apiReturnCodes = {
  unknown: -1,
  success: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  unsupportedMediaType: 415,
  unprocessableEntity: 422,
  internalServerFailure: 500
};

/**
 * Interface with BAW Server Rest API
 */
@Injectable({
  providedIn: "root"
})
export abstract class BawApiService {
  /*
  Paths:
    list -> GET
    show -> GET with id
    create -> PUT/POST
    update -> PATCH with id
    destroy -> DELETE with ID
    filter -> POST with filter body
  */

  private url = this.config.getConfig().environment.apiRoot;
  protected userSessionStorage = "user";
  protected id = (x: number) => x;
  protected param = (x: string) => x;

  constructor(private http: HttpClient, private config: AppConfigService) {}

  /**
   * Determine if the user is currently logged in
   */
  public isLoggedIn(): boolean {
    const user = this.getSessionUser();
    return user ? !!user.authToken : false;
  }

  /**
   * Retrieve user details from session cookie. Null if no user exists.
   */
  public getSessionUser(): SessionUser | null {
    try {
      return new SessionUser(
        JSON.parse(sessionStorage.getItem(this.userSessionStorage))
      );
    } catch (Exception) {
      return null;
    }
  }

  /**
   * Create a http request
   * @param method Method to use
   * @param path API Path
   * @param body Optional body content
   */
  protected apiRequest(
    method: "LIST" | "FILTER" | "SHOW" | "CREATE" | "UPDATE" | "DELETE",
    next: (data: any) => void,
    error: (err: any) => void,
    path: string,
    body?: object
  ) {
    path = this.url + path;

    switch (method) {
      case "LIST":
      case "SHOW":
        return this.http
          .get<APIResponse>(path)
          .subscribe(this.handleResponse(next, error));
      case "FILTER":
      case "CREATE":
        return this.http
          .post<APIResponse>(path, body)
          .subscribe(this.handleResponse(next, error));
      case "UPDATE":
        return this.http
          .patch<APIResponse>(path, body)
          .subscribe(this.handleResponse(next, error));
      case "DELETE":
        return this.http
          .delete<APIResponse>(path)
          .subscribe(this.handleResponse(next, error, true));
    }
  }

  /**
   * Templates a string by substituting placeholders for tokens later in execution.
   * It is designed to work as the tag function for tagged interpolated strings.
   * @returns A reusable template function that is statically checked for arity and
   * parameter type compatibility with the placeholders from the interpolated string.
   * @param strings The strings around the tokens to template
   * @param placeholders Placeholders that are substituted for token when
   *  templating is done. Note these are transform functions.
   */
  protected makeTemplate<T extends ((any: any) => any)[]>(
    strings: TemplateStringsArray,
    ...placeholders: T
  ) {
    // https://github.com/microsoft/TypeScript/issues/12754 should improve this even more
    return function template(...tokens: { [K in keyof T]: ParamType<T[K]> }) {
      // interleave the strings with the parameters
      const result = Array(strings.length + tokens.length);

      for (let i = 0; i < tokens.length; i++) {
        result[i * 2] = strings[i];
        result[i * 2 + 1] = placeholders[i](tokens[i]);
      }

      result[result.length - 1] = strings[strings.length - 1];

      return result.join("");
    };
  }

  /**
   * Handle API response
   * @param next Callback function for successful response
   * @param error Callback function for failed response
   * @param nullResponse True if response body can be empty. If set, next always be called with "true"
   */
  private handleResponse(
    next: (data: any) => void,
    error: (err: any) => void,
    nullResponse?: boolean
  ) {
    return {
      next: (response: APIResponse) => {
        if (response?.data) {
          next(response.data);
        } else if (!response && nullResponse) {
          // TODO Remove if https://github.com/QutEcoacoustics/baw-server/issues/427 is fixed
          next(true);
        } else {
          error({
            status: apiReturnCodes.unknown,
            message: "No data returned from API"
          } as APIErrorDetails);
        }
      },
      error: (err: APIErrorDetails) => {
        error(err);
      }
    };
  }
}

type ParamType<T> = T extends (arg: infer R) => any ? R : never;

/**
 * Template URL path
 */
export type Path = (...tokens: (string | number)[]) => string;

/**
 * Default filter for routes
 */
export interface Filters {
  filter?: any;
  projection?: {
    include: string[];
    exclude: string[];
  };
  sort?: {
    orderBy: string;
    direction: "desc" | "asc";
  };
  paging?: {
    page?: number;
    items?: number;
    total?: number;
    maxPage?: number;
    current?: string;
    previous?: string;
    next?: string;
  };
}

/**
 * API response
 */
export interface APIResponse {
  meta: {
    status: number;
    message: string;
    error?: {
      details: string;
      info: any;
    };
    sorting?: {
      orderBy: string;
      direction: string;
    };
    paging?: {
      page: number;
      items: number;
      total: number;
      maxPage: number;
      current: string;
      previous: string;
      next: string;
    };
  };
  data: any;
}
