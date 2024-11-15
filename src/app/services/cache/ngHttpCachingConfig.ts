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
 * const cacheContext = withNgHttpCachingContext({ isCacheable: enableCache });
 * httpClient.get("/api/endpoint", cacheContext);
 * ```
 */
export const enableCache: IsCacheablePredicate = () => true;

// this is here just for testing and is not its final location
export const defaultCachingConfig = {
  isCacheable: isCacheableDefault,
  getKey: cacheKeyDefault,
  version: environment.version,
} as const satisfies NgHttpCachingConfig;

function isCacheableDefault(req: HttpRequest<any>): boolean {
  const shouldCacheMethod = req.method === "GET" || req.method === "HEAD";
  const isFilterRequest = req.method === "POST" && req.url.endsWith("/filter");

  if (shouldCacheMethod || isFilterRequest) {
    withCacheLogging(req);
  }

  return shouldCacheMethod || isFilterRequest;
}

function cacheKeyDefault(req: HttpRequest<any>): string {
  const cacheKeyBase = req.method + "@" + req.urlWithParams;
  const requestBody = req.body;
  if (!requestBody || typeof requestBody !== "object") {
    return cacheKeyBase;
  }

  // if the request contains a body, we want to contain the request body in
  // the cache key so that requests to the same endpoint with different bodies
  // (e.g. filter requests) do not incorrectly return the same cached response
  // for different requests
  const serializedBody = req.serializeBody();
  const cacheKey = `${cacheKeyBase}:${serializedBody}`;
  return cacheKey;
}
