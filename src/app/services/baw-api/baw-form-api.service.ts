import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, Injector } from "@angular/core";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractModel } from "@models/AbstractModel";
import { Observable } from "rxjs";
import { catchError, map, mergeMap, take, tap } from "rxjs/operators";
import { BawApiService, STUB_MODEL_BUILDER } from "./baw-api.service";

/*
 * Looks for hidden input in HTML document, id of input contains
 * "g-recaptcha-response-data-" followed by the name of the form
 * (ie. "g-recaptcha-response-data-contact-us"). The seed is set inside
 * the data-sitekey property.
 */
const recaptchaSeedRegex = /id="g-recaptcha-response-data-.+?" data-sitekey="(.+?)"/;

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
export abstract class BawFormApiService<
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
      tap((response: string) => {
        // Check for recaptcha error message in page body
        const errorMsg = "Captcha response was not correct.";
        if (response.includes(errorMsg)) {
          throw Error(errorMsg);
        }
      }),
      map((page: string) => {
        // Extract auth token if exists
        const token = authTokenRegex.exec(page)?.[1];
        if (!isInstantiated(token)) {
          throw new Error(
            "Unable to retrieve authenticity token for sign up request"
          );
        }
        return token;
      }),
      // Mimic a traditional form-based request
      mergeMap((token: string) =>
        this.apiFormRequest(submissionEndpoint, body(token))
      ),
      // Complete observable
      take(1),
      // Handle custom errors
      catchError(this.handleError)
    );
  }

  /**
   * Retrieve a recatpcha seed for a form
   *
   * @param path Path to retrieve recatpcha seed from
   * @param extractSeed Regex to extract recaptcha seed from HTML response
   */
  protected getRecaptchaSeed(
    path: string,
    extractSeed: RegExp = recaptchaSeedRegex
  ): Observable<string> {
    // Mock a HTML request to the server
    return this.apiHtmlRequest(path).pipe(
      map((page: any) => {
        // Check response is HTML document
        if (typeof page !== "string") {
          throw new Error("Failed to retrieve auth form");
        }

        // Extract token from page
        const seed = extractSeed.exec(page)?.[1];
        if (!seed) {
          throw new Error(
            "Unable to retrieve recaptcha seed for registration request"
          );
        }
        return seed;
      }),
      // Complete observable
      take(1),
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
