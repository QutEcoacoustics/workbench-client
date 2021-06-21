import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";
import { Observable } from "rxjs";
import { catchError, first, map, mergeMap, tap } from "rxjs/operators";
import { BawApiService, STUB_MODEL_BUILDER } from "./baw-api.service";

/*
 * Reads through a HTML document for recaptcha setup code to extract the
 * seed and action.
 */
const extractRecaptchaValues =
  /grecaptcha\.execute\('(.+?)', {action: '(.+?)'}\)/;

/*
 * Looks for a hidden input in HTML document, name of input is
 * "authenticity_token". The auth token, which is required for form
 * based requests, is set inside the value property.
 */
const authTokenRegex = /name="authenticity_token" value="(.+?)"/;

/**
 * Interface with BAW Server using Form/HTML based requests similar to a browser.
 * This is useful when an official API route has not been created, and should be
 * treated as a temporary measure while the baw-server lags behind development.
 */
@Injectable()
export class BawFormApiService<
  Model extends AbstractModel
> extends BawApiService<Model> {
  public constructor(
    http: HttpClient,
    @Inject(API_ROOT) apiRoot: string,
    @Inject(STUB_MODEL_BUILDER)
    classBuilder: new (_: Record<string, any>, _injector?: Injector) => Model,
    injector: Injector
  ) {
    super(http, apiRoot, classBuilder, injector);
  }

  /**
   * Make a form request on non-JSON api endpoints with recaptcha
   * token
   *
   * @param formEndpoint Endpoint to retrieve form HTML
   * @param submissionEndpoint Endpoint to send form data to
   * @param body Form data to insert into api request
   * @returns HTML page for request. Response may be a success, however the
   * html contains error messages which need to be extracted
   */
  protected makeFormRequest(
    formEndpoint: string,
    submissionEndpoint: string,
    body: (authToken: string) => URLSearchParams
  ): Observable<string> {
    // Request HTML document to retrieve form containing auth token
    return this.apiHtmlRequest(formEndpoint).pipe(
      map((page: string) => {
        // Extract auth token if exists
        const token = authTokenRegex.exec(page)?.[1];
        if (!isInstantiated(token)) {
          throw new Error(
            "Unable to retrieve authenticity token for form request."
          );
        }
        return token;
      }),
      // Mimic a traditional form-based request
      mergeMap((token: string) =>
        this.apiFormRequest(submissionEndpoint, body(token))
      ),
      tap((response: string) => {
        // Check for recaptcha error message in page body
        const errorMsg = "Captcha response was not correct.";
        if (response.includes(errorMsg)) {
          throw Error(errorMsg);
        }
      }),
      // Complete observable
      first(),
      // Handle custom errors
      catchError(this.handleError)
    );
  }

  protected makeFormRequestWithoutOutput(
    formEndpoint: string,
    submissionEndpoint: string,
    body: (authToken: string) => URLSearchParams
  ): Observable<void> {
    return this.makeFormRequest(formEndpoint, submissionEndpoint, body).pipe(
      map(() => undefined)
    );
  }

  /**
   * Retrieve a recatpcha seed for a form
   *
   * @param path Path to retrieve recatpcha seed from
   * @param extractSeed Regex to extract recaptcha seed from HTML response
   */
  protected getRecaptchaSeed(path: string): Observable<RecaptchaSettings> {
    // Mock a HTML request to the server
    return this.apiHtmlRequest(path).pipe(
      map((page: string) => {
        // Extract seed and action from page
        const values = extractRecaptchaValues.exec(page);
        const seed = values?.[1];
        const action = values?.[2];

        if (!seed || !action) {
          throw new Error("Unable to setup recaptcha.");
        }
        return { seed, action };
      }),
      // Complete observable
      first(),
      // Handle custom errors
      catchError(this.handleError)
    );
  }

  /**
   * Request a HTML page from the API. This will be used to extract important
   * information required to make form-based requests later on
   *
   * @param path API path
   */
  protected apiHtmlRequest(path: string): Observable<string> {
    return this.http.get(this.getPath(path), {
      responseType: "text",
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: new HttpHeaders({ Accept: "text/html" }),
    });
  }

  /**
   * Create a form-based request to interface with non JSON API endpoints of the
   * baw-server. As a side affect, this will also generate a session cookies
   * which can be used to create an auth token.
   *
   * @param path API path
   * @param formData Request body
   */
  protected apiFormRequest(
    path: string,
    formData: URLSearchParams
  ): Observable<string> {
    return this.http.post(this.getPath(path), formData.toString(), {
      responseType: "text",
      headers: new HttpHeaders({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: "text/html",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "Content-Type": "application/x-www-form-urlencoded",
      }),
    });
  }
}

export interface RecaptchaSettings {
  seed: string;
  action: string;
}
