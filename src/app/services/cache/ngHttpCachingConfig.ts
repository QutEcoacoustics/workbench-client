import { HttpRequest } from "@angular/common/http";
import { NgHttpCachingConfig } from "ng-http-caching";
import { environment } from "src/environments/environment";
import { withCacheLogging } from "./cache-logging.service";

type IsCacheablePredicate = NgHttpCachingConfig["isCacheable"];

/**
 * forces caching to be disabled for a request and ignores the default baw
 * caching behavior
 *
 * @example
 * ```ts
 * const cacheOptions: NgHttpCachingConfig = { isCacheable: disableCache };
 * bawApi.show("/api/endpoint", { cache: cacheOptions });
 * ```
 *
 * @example
 * ```ts
 * const cacheContext = withNgHttpCachingContext({ isCacheable: disableCache });
 * httpClient.get("/api/endpoint", cacheContext);
 * ```
 */
export const disableCache: IsCacheablePredicate = () => false;

/**
 * forces caching to be enabled for a request and ignores the default baw
 * caching behavior
 *
 * @example
 * ```ts
 * const cacheOptions: NgHttpCachingConfig = { isCacheable: enableCache };
 * bawApi.show("/api/endpoint", { cache: cacheOptions });
 * ```
 *
 * @example
 * ```ts
 * const cacheContext = withNgHttpCachingContext({ isCacheable: enableCache });
 * httpClient.get("/api/endpoint", cacheContext);
 * ```
 */
export const enableCache: IsCacheablePredicate = () => true;

export const defaultCachingConfig = {
  isCacheable: isCacheableDefault,

  // by setting the workbench clients version as the cache version,
  // ng-http-caching will automatically invalidate the cache when the client
  // updates to a new version
  version: environment.version,
} as const satisfies NgHttpCachingConfig;

// TODO: update this method when we add support for caching filter requests
// see: https://github.com/QutEcoacoustics/workbench-client/issues/2170
function isCacheableDefault(req: HttpRequest<any>): boolean {
  const shouldCacheMethod = req.method === "GET" || req.method === "HEAD";
  // const isFilterRequest = req.method === "POST" && req.url.endsWith("/filter");
  const isCacheable = shouldCacheMethod;

  // we support debug logging of requests that will be cached through the sites
  // admin panel
  // this is useful for debugging caching issues
  if (isCacheable) {
    withCacheLogging(req.context);
  }

  return isCacheable;
}

// TODO: when we add support for caching filter requests we will need to use a
// custom cache key function that includes the request body in the cache key
// see: https://github.com/QutEcoacoustics/workbench-client/issues/2170
//
// function cacheKeyDefault(req: HttpRequest<any>): string {
//   const cacheKeyBase = req.method + "@" + req.urlWithParams;
//   const requestBody = req.body;
//   if (!requestBody || typeof requestBody !== "object") {
//     return cacheKeyBase;
//   }

//   // if the request contains a body, we want to contain the request body in
//   // the cache key so that requests to the same endpoint with different bodies
//   // (e.g. filter requests) do not incorrectly return the same cached response
//   // for different requests
//   //
//   // we do this by hashing the request body and appending it to the cache key
//   //
//   // while md5 is not a secure hashing algorithm for, we use it for
//   // request caching keys because it is faster than more secure hashing
//   // algorithms such as sha256, and we are not storing any sensitive data from
//   // other uses in the cache key
//   // since we might be performing this hashing operation many times per second
//   // we want to use the fastest hashing algorithm possible
//   const hashedBody = hash(requestBody, { algorithm: "md5" });
//   const cacheKey = `${cacheKeyBase}@${hashedBody}`;
//   return cacheKey;
// }
