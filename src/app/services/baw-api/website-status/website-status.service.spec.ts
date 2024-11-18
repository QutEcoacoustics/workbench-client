import {
  SpectatorService,
  SpyObject,
  createServiceFactory,
} from "@ngneat/spectator";
import {
  mockServiceImports,
  mockServiceProviders,
} from "@test/helpers/api-common";
import { BawApiService } from "@baw-api/baw-api.service";
import { WebsiteStatus } from "@models/WebsiteStatus";
import { of } from "rxjs";
import { NgHttpCachingService } from "ng-http-caching";
import { WebsiteStatusService } from "./website-status.service";

describe("WebsiteStatusService", () => {
  let spec: SpectatorService<WebsiteStatusService>;
  let mockApi: SpyObject<BawApiService<WebsiteStatus>>;
  let cachingSpy: SpyObject<NgHttpCachingService>;

  const createService = createServiceFactory({
    service: WebsiteStatusService,
    imports: mockServiceImports,
    providers: mockServiceProviders,
  });

  function setup(): void {
    spec = createService({});

    cachingSpy = spec.inject(NgHttpCachingService);

    mockApi = spec.inject(BawApiService<WebsiteStatus>);
    mockApi.httpGet = jasmine.createSpy("httpGet") as any;
    mockApi.httpGet.and.returnValue(of());

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date("2020-01-01T00:00:00.000+09:30"));
  }

  beforeEach(() => setup());

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should create", () => {
    expect(spec.service).toBeInstanceOf(WebsiteStatusService);
  });

  it("should call httpGet with the correct options", () => {
    const expectedHeaders = spec.service["requestHeaders"];
    const expectedOptions = {
      cacheOptions: { isCacheable: jasmine.any(Function) },
      withCredentials: false,
    };

    spec.service["show"]().subscribe();

    const [realizedUrl, realizedHeaders, realizedOptions] =
      mockApi.httpGet.calls.mostRecent().args;

    expect(realizedUrl).toBe("/status");
    expect(realizedHeaders).toEqual(expectedHeaders);
    expect(realizedOptions).toEqual(expectedOptions);

    const realizedShouldCache = realizedOptions.cacheOptions.isCacheable();
    return expect(realizedShouldCache).toBeFalse();
  });

  it("should not cache the request", () => {
    spec.service["show"]().subscribe();

    const cacheSize = cachingSpy.getStore().size;
    expect(cacheSize).toEqual(0);
  });
});
