import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TestRequest } from "@angular/common/http/testing";
import {
  BawApiInterceptor,
} from "@baw-api/api.interceptor.service";
import {
  ApiResponse,
  BawApiService,
  BawServiceOptions,
  defaultApiHeaders,
  Filters,
  Meta,
} from "@baw-api/baw-api.service";
import { MockSecurityService } from "@baw-api/mock/securityMock.service";
import { SecurityService } from "@baw-api/security/security.service";
import { UserService } from "@baw-api/user/user.service";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { AuthToken } from "@interfaces/apiInterfaces";
import { AbstractModel, getUnknownViewUrl } from "@models/AbstractModel";
import { bawPersistAttr } from "@models/AttributeDecorators";
import { User } from "@models/User";
import {
  createHttpFactory,
  HttpMethod,
  mockProvider,
  SpectatorHttp,
  SpyObject,
} from "@ngneat/spectator";
import { CacheSettings, CACHE_SETTINGS } from "@services/cache/cache-settings";
import { CacheModule } from "@services/cache/cache.module";
import { API_ROOT } from "@services/config/config.tokens";
import { MockConfigModule } from "@services/config/configMock.module";
import { generateUser } from "@test/fakes/User";
import { modelData } from "@test/helpers/faker";
import { assertOk } from "@test/helpers/general";
import { UNAUTHORIZED, UNPROCESSABLE_ENTITY } from "http-status";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, noop, Observable, Subject } from "rxjs";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { mockAssociationInjector } from "@services/association-injector/association-injectorMock.factory";
import { NgHttpCachingService } from "ng-http-caching";
import {
  BawSessionService,
  guestAuthToken,
  guestUser,
} from "./baw-session.service";
import { MockShowApiService } from "./mock/apiMocks.service";

export const shouldNotSucceed = () => {
  fail("Service should not produce a data output");
};
export const shouldNotFail = () => {
  fail("Service should not produce an error");
};
export const shouldNotComplete = () => {
  fail("Service should not complete");
};

class IMockModel {
  public id?: number;
  public name?: string;
  public caseConversion?: {
    testConvert?: string;
  };
}

class MockModel extends AbstractModel implements IMockModel {
  public kind = "Mock Model";
  @bawPersistAttr()
  public readonly id?: number;
  @bawPersistAttr()
  public readonly name?: string;
  @bawPersistAttr()
  public readonly caseConversion?: {
    testConvert?: string;
  };

  public constructor(data: IMockModel, modelInjector?: AssociationInjector) {
    super(data, modelInjector);
  }

  public override get viewUrl(): string {
    return getUnknownViewUrl("Mock Model does not have a viewUrl");
  }
}

// TODO Add tests for multipart requests
describe("BawApiService", () => {
  let meta: {
    /** Single model response */
    single: Meta<IMockModel>;
    /** Array response */
    multi: Meta<IMockModel>;
    /** Basic error response */
    error: Meta<IMockModel>;
    /** Extended error response */
    errorInfo: Meta<IMockModel>;
  };

  let responses: {
    /** Single model */
    single: IMockModel;
    /** Multiple models */
    multi: IMockModel[];
    /** Basic error */
    error: BawApiError;
    /** Extended error */
    errorInfo: BawApiError;
  };

  let cacheSettings: CacheSettings;
  let defaultAuthToken: AuthToken;
  let defaultUser: User;
  let apiRoot: string;
  let session: BawSessionService;
  let service: BawApiService<MockModel>;
  let associationInjector: AssociationInjector;
  let cachingSpy: SpyObject<NgHttpCachingService>;
  let spec: SpectatorHttp<BawApiService<MockModel>>;

  const createService = createHttpFactory<BawApiService<MockModel>>({
    service: BawApiService,
    imports: [MockConfigModule, CacheModule],
    providers: [
      BawSessionService,
      mockProvider(ToastrService),
      { provide: SecurityService, useClass: MockSecurityService },
      { provide: UserService, useClass: MockShowApiService },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: BawApiInterceptor,
        multi: true,
      },
      mockAssociationInjector,
    ],
  });

  function signIn(user: User, authToken: AuthToken) {
    session.setLoggedInUser(user, authToken);
  }

  function signOut() {
    session.clearLoggedInUser();
  }

  function flushResponse<T>(req: TestRequest, response: ApiResponse<T>) {
    req.flush(response, {
      status: response.meta.status,
      statusText: response.meta.message,
    });
  }

  function catchRequest(route: string, method: HttpMethod) {
    return spec.expectOne(apiRoot + route, method);
  }

  function verifyHeaders(req: TestRequest) {
    const headers = req.request.headers;
    expect(headers.get("Accept")).toBe(
      "application/json",
      "Request should contain Accept Headers set to 'application/json'"
    );
    expect(headers.get("Content-Type")).toBe(
      "application/json",
      "Request should contain Content-Type Headers set to 'application/json"
    );
  }

  function verifyAuthHeaders(req: TestRequest, authToken: string) {
    verifyHeaders(req);
    expect(req.request.headers.get("Authorization")).toBe(
      `Token token="${authToken}"`,
      "Request should container Authorization Header with token set"
    );
  }

  beforeEach(() => {
    spec = createService();
    service = spec.service;
    apiRoot = spec.inject(API_ROOT);
    session = spec.inject(BawSessionService);
    associationInjector = spec.inject(ASSOCIATION_INJECTOR);

    cachingSpy = spec.inject(NgHttpCachingService);
    cacheSettings = spec.inject(CACHE_SETTINGS);
    cacheSettings.setCaching(true);

    defaultAuthToken = modelData.authToken();
    defaultUser = new User(generateUser());

    const successMeta = { status: 200, message: "OK" };
    meta = {
      single: successMeta,
      multi: {
        ...successMeta,
        sorting: { orderBy: "name", direction: "asc" },
        paging: { page: 1, items: 1, total: 1, maxPage: 1 },
      },
      error: {
        status: 401,
        message: "Unauthorized",
        error: { details: "Unauthorized Access", info: undefined },
      },
      errorInfo: {
        status: 422,
        message: "Unprocessable Entity",
        error: {
          details: "Record could not be saved",
          info: { name: ["has already been taken"], image: [] },
        },
      },
    };

    const model = {
      id: 1,
      name: "name",
      caseConversion: { testConvert: "converted" },
    };
    responses = {
      single: model,
      multi: [model],
      error: new BawApiError(UNAUTHORIZED, "Unauthorized Access"),
      errorInfo: new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Record could not be saved",
        { name: ["has already been taken"], image: [] }
      ),
    };
  });

  afterEach(() => {
    spec.controller.verify();
    cachingSpy.clearCache();
  });

  describe("Session Tracking", () => {
    it("should not be logged in", () => {
      expect(session.isLoggedIn).toBe(false);
    });

    it("should not return user", () => {
      expect(session.loggedInUser).toBe(guestUser);
    });

    it("should be logged in after sign in", () => {
      signIn(defaultUser, defaultAuthToken);
      expect(session.isLoggedIn).toBeTruthy();
    });

    it("should successfully store user", () => {
      signIn(defaultUser, defaultAuthToken);
      expect(session.loggedInUser).toBe(defaultUser);
    });

    it("should successfully store auth token", () => {
      signIn(defaultUser, defaultAuthToken);
      expect(session.authToken).toBe(defaultAuthToken);
    });

    it("should not be logged in after sign out", () => {
      signIn(defaultUser, defaultAuthToken);
      signOut();
      expect(session.isLoggedIn).toBe(false);
    });

    it("should not return user after sign out", () => {
      signIn(defaultUser, defaultAuthToken);
      signOut();
      expect(session.loggedInUser).toBe(guestUser);
    });

    it("should not return auth token after sign out", () => {
      signIn(defaultUser, defaultAuthToken);
      signOut();
      expect(session.authToken).toBe(guestAuthToken);
    });
  });

  describe("HTTP Request Methods", () => {
    const httpMethods = [
      { functionName: "httpGet", method: HttpMethod.GET, hasBody: false },
      { functionName: "httpPost", method: HttpMethod.POST, hasBody: true },
      { functionName: "httpPatch", method: HttpMethod.PATCH, hasBody: true },
      { functionName: "httpDelete", method: HttpMethod.DELETE, hasBody: false },
    ];

    httpMethods.forEach((httpMethod) => {
      describe(httpMethod.functionName, () => {
        function functionCall(
          opts: unknown[] = [],
          next: (value: any) => void = noop,
          error: (err: any) => void = noop,
          complete: () => void = noop
        ): void {
          (
            service[httpMethod.functionName](
              "/broken_link",
              ...opts
            ) as Observable<ApiResponse<unknown>>
          ).subscribe({
            next,
            error,
            complete,
          });
        }

        function catchFunctionCall() {
          return catchRequest("/broken_link", httpMethod.method);
        }

        it(`should create ${httpMethod.method} request`, () => {
          functionCall();
          expect(catchFunctionCall()).toBeTruthy();
        });

        it("should create request with baw server headers", () => {
          functionCall();
          verifyHeaders(catchFunctionCall());
        });

        it("should create request with authenticated baw server headers", () => {
          signIn(defaultUser, defaultAuthToken);
          functionCall();
          verifyAuthHeaders(catchFunctionCall(), defaultAuthToken);
        });

        it("should create a request with authentication headers when withCredentials is not set", () => {
          signIn(defaultUser, defaultAuthToken);

          let functionCallOptions: unknown[];

          // we have a special case for GET and GET because these function signatures don't take a body argument
          // (the third argument in every other function)
          if (
            httpMethod.method === HttpMethod.DELETE ||
            httpMethod.method === HttpMethod.GET
          ) {
            functionCallOptions = [undefined, { withCredentials: false }];
          } else {
            functionCallOptions = [
              undefined,
              undefined,
              { withCredentials: false },
            ];
          }

          functionCall(functionCallOptions);

          const request = catchFunctionCall();
          verifyHeaders(request);
          expect(request.request.headers.get("Authorization")).toBeNull();
        });

        it("should create a request with authentication headers when withCredentials is explicitly set to true", () => {
          signIn(defaultUser, defaultAuthToken);

          let functionCallOptions: unknown[];

          if (
            httpMethod.method === HttpMethod.DELETE ||
            httpMethod.method === HttpMethod.GET
          ) {
            functionCallOptions = [undefined, { withCredentials: true }];
          } else {
            functionCallOptions = [
              undefined,
              undefined,
              { withCredentials: true },
            ];
          }

          functionCall(functionCallOptions);

          const request = catchFunctionCall();
          verifyAuthHeaders(request, defaultAuthToken);
          expect(request.request.headers.get("Authorization")).toBeDefined();
        });

        it("should not create a request with authentication headers when withCredentials is set to false", () => {
          signIn(defaultUser, defaultAuthToken);

          let functionCallOptions: unknown[];

          if (
            httpMethod.method === HttpMethod.DELETE ||
            httpMethod.method === HttpMethod.GET
          ) {
            functionCallOptions = [undefined, { withCredentials: false }];
          } else {
            functionCallOptions = [
              undefined,
              undefined,
              { withCredentials: false },
            ];
          }

          functionCall(functionCallOptions);

          const request = catchFunctionCall();
          verifyHeaders(request);
          expect(request.request.headers.get("Authorization")).toBeNull();
        });

        it("should return single response", (done) => {
          const response = { meta: meta.single, data: responses.single };
          functionCall(
            undefined,
            (data) => {
              expect(data).toEqual(response);
              done();
            },
            shouldNotFail
          );
          flushResponse(catchFunctionCall(), response);
        });

        it("should return multi response", (done) => {
          const response = { meta: meta.multi, data: responses.multi };
          functionCall(
            undefined,
            (data) => {
              expect(data).toEqual(response);
              done();
            },
            shouldNotFail
          );
          flushResponse(catchFunctionCall(), response);
        });

        it("should handle error response", (done) => {
          const response = { meta: meta.error, data: null };
          functionCall(undefined, shouldNotSucceed, (err) => {
            expect(err).toEqual(responses.error);
            done();
          });
          flushResponse(catchFunctionCall(), response);
        });

        it("should handle error response with info", (done) => {
          const response = { meta: meta.errorInfo, data: null };
          functionCall(undefined, shouldNotSucceed, (err) => {
            expect(err).toEqual(responses.errorInfo);
            done();
          });
          flushResponse(catchFunctionCall(), response);
        });

        it("should complete on success", (done) => {
          const response = { meta: meta.single, data: responses.single };
          functionCall(undefined, noop, noop, () => {
            assertOk();
            done();
          });
          flushResponse(catchFunctionCall(), response);
        });

        // If http method can accept body inputs
        if (httpMethod.hasBody) {
          it("should accept empty body", () => {
            service[httpMethod.functionName]("/broken_link", {}).subscribe();
            const req = catchRequest("/broken_link", httpMethod.method);
            expect(req.request.body).toEqual({});
          });

          it("should accept body", () => {
            service[httpMethod.functionName]("/broken_link", {
              key: "value",
            }).subscribe();
            const req = catchRequest("/broken_link", httpMethod.method);
            expect(req.request.body).toEqual({ key: "value" });
          });

          it("should convert body keys", () => {
            service[httpMethod.functionName]("/broken_link", {
              caseConversion: "value",
            }).subscribe();
            const req = catchRequest("/broken_link", httpMethod.method);
            // eslint-disable-next-line @typescript-eslint/naming-convention
            expect(req.request.body).toEqual({ case_conversion: "value" });
          });

          it("should convert nested body keys", () => {
            service[httpMethod.functionName]("/broken_link", {
              caseConversion: {
                nestedConversion: 42,
              },
            }).subscribe();
            const req = catchRequest("/broken_link", httpMethod.method);
            expect(req.request.body).toEqual({
              // eslint-disable-next-line @typescript-eslint/naming-convention
              case_conversion: { nested_conversion: 42 },
            });
          });
        }
      });
    });

    // describe("httpGet", () => {
    //   let defaultCache: ContextOptions;

    //   function catchFunctionCall() {
    //     return catchRequest("/broken_link", HttpMethod.GET);
    //   }

    //   beforeEach(() => {
    //     defaultCache = {
    //       ttl: cacheSettings.httpGetTtlMs,
    //       context: withCacheLogging(),
    //     };
    //   });

    //   it("should cache results when given", () => {
    //     const cacheOptions = { cache: true };

    //     service
    //       .httpGet("/broken_link", defaultApiHeaders, { cacheOptions })
    //       .subscribe();

    //     const context = catchFunctionCall().request.context;
    //     const expectedContext = withCache({
    //       cache: true,
    //       ...defaultCache,
    //     }).set(CREDENTIALS_CONTEXT, true);

    //     expect(context).toEqual(expectedContext);
    //   });

    //   it("should override default cache settings", () => {
    //     const cacheOptions: ContextOptions = { cache: true, ttl: 10000 };
    //     service
    //       .httpGet("/broken_link", defaultApiHeaders, { cacheOptions })
    //       .subscribe();
    //     const context = catchFunctionCall().request.context;
    //     const expectedContext = withCache({
    //       ...defaultCache,
    //       ...cacheOptions,
    //     }).set(CREDENTIALS_CONTEXT, true);

    //     expect(context).toEqual(expectedContext);
    //   });

    //   it("should not cache results when not explicitly provided", () => {
    //     service.httpGet("/broken_link").subscribe();
    //     const context = catchFunctionCall().request.context;
    //     const expectedContext = withCache({
    //       cache: false,
    //       ttl: cacheSettings.httpGetTtlMs,
    //       context: withCacheLogging(),
    //     }).set(CREDENTIALS_CONTEXT, true);

    //     expect(context).toEqual(expectedContext);
    //   });

    //   it("should allow settings both cache and authentication contexts to non-default values", () => {
    //     const cacheOptions: ContextOptions = { cache: true, ttl: 10000 };
    //     const options: BawServiceOptions = {
    //       cacheOptions,
    //       withCredentials: false,
    //     };

    //     service.httpGet("/broken_link", defaultApiHeaders, options).subscribe();

    //     const context = catchFunctionCall().request.context;
    //     const expectedContext = withCache({
    //       ...defaultCache,
    //       ...cacheOptions,
    //     }).set(CREDENTIALS_CONTEXT, false);

    //     expect(context).toEqual(expectedContext);
    //   });
    // });
  });

  describe("API Request Methods", () => {
    const tests: {
      method: keyof BawApiService<AbstractModel>;
      http: keyof BawApiService<AbstractModel>;
      hasBody?: boolean;
      hasFilter?: boolean;
      singleResult?: boolean;
      multiResult?: boolean;
      updateOnAuthTrigger?: boolean;
    }[] = [
      {
        method: "list",
        http: "httpGet",
        multiResult: true,
        updateOnAuthTrigger: true,
      },
      {
        method: "filter",
        http: "httpPost",
        multiResult: true,
        updateOnAuthTrigger: true,
      },
      {
        method: "show",
        http: "httpGet",
        singleResult: true,
        updateOnAuthTrigger: true,
      },
      {
        method: "create",
        http: "httpPost",
        singleResult: true,
      },
      {
        method: "update",
        http: "httpPatch",
        singleResult: true,
      },
      {
        method: "destroy",
        http: "httpDelete",
        singleResult: true,
      },
    ];
    tests.forEach(
      ({ method, http, singleResult, multiResult, updateOnAuthTrigger }) => {
        describe(method, () => {
          let defaultBody: IMockModel;
          let defaultFilter: Filters<IMockModel>;
          // the default options for the baw service methods eg. show, create, list, filterShow, filter, etc...
          // because the default options are applied in lower level methods eg. httpGet, httpPost, etc...
          // we expect that low level methods are called by high level methods with an empty options object as their default
          // (indicating no options were passed in by the programmer)
          // if options are passed in by the programmer, the options object will be a partial options object
          let defaultBawMethodOptions: BawServiceOptions;

          beforeEach(() => {
            defaultBody = { id: 1, name: "test", caseConversion: {} };
            defaultFilter = { paging: { page: 1 } };
            defaultBawMethodOptions = {};
          });

          function errorRequest(error: BawApiError): jasmine.Spy {
            const spy = jasmine.createSpy(http).and.callFake(() => {
              const subject = new Subject();
              subject.error(error);
              return subject;
            });
            service[http] = spy;
            return spy;
          }

          function successRequest(response: ApiResponse<unknown>): jasmine.Spy {
            const spy = jasmine.createSpy(http).and.callFake(() => {
              const subject = new BehaviorSubject<ApiResponse<unknown>>(
                response
              );
              setTimeout(() => subject.complete(), 0);
              return subject;
            });
            service[http] = spy;
            return spy;
          }

          function functionCall(): Observable<MockModel[] | MockModel> {
            switch (method) {
              case "list":
              case "show":
                return service[method](MockModel, "/broken_link");
              case "filter":
                return service[method](
                  MockModel,
                  "/broken_link",
                  defaultFilter
                );
              case "create":
                return service[method](
                  MockModel,
                  "/broken_link",
                  (model) => "/broken_link/" + model.id,
                  new MockModel(defaultBody, associationInjector)
                );
              case "update":
                return service[method](
                  MockModel,
                  "/broken_link",
                  new MockModel(defaultBody, associationInjector)
                );
              case "destroy":
                return service[method]("/broken_link");
            }
          }

          it(`should call ${http}`, () => {
            const response = singleResult
              ? { meta: meta.single, data: responses.single }
              : { meta: meta.multi, data: [] };
            const spy = successRequest(response);
            functionCall().subscribe();

            switch (method) {
              case "list":
              case "show":
                expect(spy).toHaveBeenCalledWith(
                  "/broken_link",
                  defaultApiHeaders,
                  defaultBawMethodOptions
                );
                break;
              case "filter":
                expect(spy).toHaveBeenCalledWith(
                  "/broken_link",
                  defaultFilter,
                  undefined,
                  defaultBawMethodOptions
                );
                break;
              case "create":
              case "update":
                expect(spy).toHaveBeenCalledWith(
                  "/broken_link",
                  {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    "Mock Model": defaultBody,
                  },
                  undefined,
                  defaultBawMethodOptions
                );
                break;
              case "destroy":
                expect(spy).toHaveBeenCalledWith(
                  "/broken_link",
                  undefined,
                  defaultBawMethodOptions
                );
                break;
            }
          });

          if (singleResult) {
            it("should handle response", (done) => {
              const response = { meta: meta.single, data: responses.single };
              const model = new MockModel(
                response.data,
                associationInjector
              );
              model.addMetadata(response.meta);

              successRequest(response);
              functionCall().subscribe({
                next: (data) => {
                  // Destroy returns void
                  if (method === "destroy") {
                    expect(data).toBe(null);
                  } else {
                    expect(data).toEqual(model);
                  }
                  done();
                },
                error: shouldNotFail,
              });
            });
          }

          if (multiResult) {
            it("should handle empty response", (done) => {
              successRequest({ meta: meta.multi, data: [] });
              functionCall().subscribe({
                next: (data) => {
                  expect(data).toEqual([]);
                  done();
                },
                error: shouldNotFail,
              });
            });

            it("should handle response", (done) => {
              const response = { meta: meta.multi, data: responses.multi };
              const models = response.data.map((_data) => {
                const model = new MockModel(_data, associationInjector);
                model.addMetadata(response.meta);
                return model;
              });

              successRequest(response);
              functionCall().subscribe({
                next: (data) => {
                  expect(data).toEqual(models);
                  done();
                },
                error: shouldNotFail,
              });
            });
          }

          it("should handle error response", (done) => {
            errorRequest(responses.error);
            functionCall().subscribe({
              next: shouldNotSucceed,
              error: (err) => {
                expect(err).toEqual(responses.error);
                done();
              },
            });
          });

          it("should handle error info response", (done) => {
            errorRequest(responses.errorInfo);
            functionCall().subscribe({
              next: shouldNotSucceed,
              error: (err) => {
                expect(err).toEqual(responses.errorInfo);
                done();
              },
            });
          });

          if (updateOnAuthTrigger) {
            if (singleResult) {
              it("should retrigger if auth changes", (done) => {
                let count = 0;
                const response = { meta: meta.single, data: responses.single };
                const model = new MockModel(
                  responses.single,
                  associationInjector
                );
                model.addMetadata(response.meta);

                successRequest(response);
                functionCall().subscribe({
                  next: (data): void => {
                    expect(data).toEqual(model);
                    if (count === 2) {
                      done();
                    } else {
                      count++;
                    }
                  },
                  error: shouldNotFail,
                });
                signIn(defaultUser, defaultAuthToken);
                signOut();
              });
            }

            if (multiResult) {
              it("should retrigger if auth changes", (done) => {
                let count = 0;
                const response = { meta: meta.multi, data: responses.multi };
                const models = responses.multi.map((_data) => {
                  const model = new MockModel(_data, associationInjector);
                  model.addMetadata(response.meta);
                  return model;
                });

                successRequest(response);
                functionCall().subscribe({
                  next: (data): void => {
                    expect(data).toEqual(models);
                    if (count === 2) {
                      done();
                    } else {
                      count++;
                    }
                  },
                  error: shouldNotFail,
                });
                signIn(defaultUser, defaultAuthToken);
                signOut();
              });
            }
          } else {
            it("should complete on api response", (done) => {
              const response = singleResult
                ? { meta: meta.single, data: responses.single }
                : { meta: meta.multi, data: responses.multi };
              successRequest(response);
              functionCall().subscribe({
                error: shouldNotFail,
                complete: () => {
                  assertOk();
                  done();
                },
              });
            });
          }
        });
      }
    );
  });
});
