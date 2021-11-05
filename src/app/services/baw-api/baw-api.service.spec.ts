import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { TestRequest } from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import {
  ApiErrorDetails,
  BawApiInterceptor,
} from "@baw-api/api.interceptor.service";
import {
  ApiResponse,
  BawApiService,
  Filters,
  Meta,
  STUB_MODEL_BUILDER,
} from "@baw-api/baw-api.service";
import { MockSecurityService } from "@baw-api/mock/securityMock.service";
import { SecurityService } from "@baw-api/security/security.service";
import { UserService } from "@baw-api/user/user.service";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { AbstractModel, getUnknownViewUrl } from "@models/AbstractModel";
import { SessionUser } from "@models/User";
import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from "@ngneat/spectator";
import { MockAppConfigModule } from "@services/config/configMock.module";
import { generateSessionUser } from "@test/fakes/User";
import { BehaviorSubject, noop, Observable, Subject } from "rxjs";
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
  public kind = "MockModel";
  public readonly id?: number;
  public readonly name?: string;
  public readonly caseConversion?: {
    testConvert?: string;
  };

  public constructor(data: IMockModel, modelInjector?: Injector) {
    super(data, modelInjector);
  }

  public toJSON(_: any) {
    return {
      id: this.id,
      name: this.name,
      caseConversion: this.caseConversion,
    } as Partial<this>;
  }

  public get viewUrl(): string {
    return getUnknownViewUrl("MockModel does not have a viewUrl");
  }
}

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
    error: ApiErrorDetails;
    /** Extended error */
    errorInfo: ApiErrorDetails;
  };

  let sessionUser: SessionUser;
  let apiRoot: string;
  let service: BawApiService<MockModel>;
  let spec: SpectatorHttp<BawApiService<MockModel>>;
  const createService = createHttpFactory<BawApiService<MockModel>>({
    service: BawApiService,
    imports: [MockAppConfigModule],
    providers: [
      BawApiService,
      { provide: SecurityService, useClass: MockSecurityService },
      { provide: UserService, useClass: MockShowApiService },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: BawApiInterceptor,
        multi: true,
      },
      { provide: STUB_MODEL_BUILDER, useValue: MockModel },
    ],
  });

  function signIn(_sessionUser: SessionUser) {
    localStorage.setItem("baw.client.user", JSON.stringify(_sessionUser));
  }

  function signOut() {
    localStorage.removeItem("baw.client.user");
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
    localStorage.clear();
    spec = createService();
    service = spec.service;
    apiRoot = spec.inject(API_ROOT);
    sessionUser = new SessionUser(generateSessionUser());

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

    const modelData = {
      id: 1,
      name: "name",
      caseConversion: { testConvert: "converted" },
    };
    responses = {
      single: modelData,
      multi: [modelData],
      error: { status: 401, message: "Unauthorized Access", info: undefined },
      errorInfo: {
        status: 422,
        message: "Record could not be saved",
        info: { name: ["has already been taken"], image: [] },
      },
    };
  });

  afterEach(() => {
    localStorage.clear();
    spec.controller.verify();
  });

  describe("Session Tracking", () => {
    it("should not change local storage on first load", () => {
      expect(localStorage.length).toBe(0);
    });

    it("should not be logged in", () => {
      expect(service.isLoggedIn()).toBe(false);
    });

    it("should not return user", () => {
      expect(service.getLocalUser()).toBe(undefined);
    });

    it("should be logged in after user saved to local storage", () => {
      signIn(sessionUser);
      expect(service.isLoggedIn()).toBeTruthy();
    });

    it("should return user after user saved to local storage", () => {
      signIn(sessionUser);
      expect(service.getLocalUser().authToken).toBe(sessionUser.authToken);
      expect(service.getLocalUser().userName).toBe(sessionUser.userName);
    });

    it("should not be logged in after user removed from local storage", () => {
      signIn(sessionUser);
      signOut();
      expect(service.isLoggedIn()).toBe(false);
    });

    it("should not return user after user removed from local storage", () => {
      signIn(sessionUser);
      signOut();
      expect(service.getLocalUser()).toBe(undefined);
    });

    it("should handle corrupted user data", () => {
      localStorage.setItem("baw.client.user", '{"');
      expect(service.getLocalUser()).toBe(undefined);
      expect(service.isLoggedIn()).toBe(false);
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
          opts: (string | number)[] = [],
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
          signIn(sessionUser);
          functionCall();
          verifyAuthHeaders(catchFunctionCall(), sessionUser.authToken);
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
            expect(true).toBeTruthy();
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
  });

  describe("API Request Methods", () => {
    type HttpFunctionCall = "httpGet" | "httpDelete" | "httpPost" | "httpPatch";

    const tests: {
      method: string;
      http: HttpFunctionCall;
      hasBody?: boolean;
      hasFilter?: boolean;
      singleResult?: boolean;
      multiResult?: boolean;
    }[] = [
      {
        method: "apiList",
        http: "httpGet",
        multiResult: true,
      },
      {
        method: "apiFilter",
        http: "httpPost",
        hasFilter: true,
        multiResult: true,
      },
      {
        method: "apiShow",
        http: "httpGet",
        singleResult: true,
      },
      {
        method: "apiCreate",
        http: "httpPost",
        hasBody: true,
        singleResult: true,
      },
      {
        method: "apiUpdate",
        http: "httpPatch",
        hasBody: true,
        singleResult: true,
      },
      {
        method: "apiDestroy",
        http: "httpDelete",
        singleResult: true,
      },
    ];
    tests.forEach(
      ({ method, http, hasFilter, hasBody, singleResult, multiResult }) => {
        describe(method, () => {
          let defaultBody: IMockModel;
          let defaultFilter: Filters<IMockModel>;

          beforeEach(() => {
            defaultBody = { id: 1, name: "test", caseConversion: {} };
            defaultFilter = { paging: { page: 1 } };
          });

          function errorRequest(error: ApiErrorDetails): jasmine.Spy {
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

          function functionCall() {
            if (hasBody) {
              return service[method](
                "/broken_link",
                new MockModel(defaultBody, service["injector"])
              );
            } else if (hasFilter) {
              return service[method]("/broken_link", defaultFilter);
            } else {
              return service[method]("/broken_link");
            }
          }

          it(`should call ${http}`, () => {
            const response = singleResult
              ? { meta: meta.single, data: responses.single }
              : { meta: meta.multi, data: [] };
            const spy = successRequest(response);
            functionCall().subscribe();

            if (hasBody) {
              expect(spy).toHaveBeenCalledWith("/broken_link", defaultBody);
            } else if (hasFilter) {
              expect(spy).toHaveBeenCalledWith("/broken_link", defaultFilter);
            } else {
              expect(spy).toHaveBeenCalledWith("/broken_link");
            }
          });

          if (singleResult) {
            it("should handle response", (done) => {
              const response = { meta: meta.single, data: responses.single };
              successRequest(response);
              functionCall().subscribe((data) => {
                // Destroy returns void
                if (method === "apiDestroy") {
                  expect(data).toBe(null);
                } else {
                  expect(data).toEqual(
                    new MockModel(response.data, service["injector"])
                  );
                }
                done();
              }, shouldNotFail);
            });
          }

          if (multiResult) {
            it("should handle empty response", (done) => {
              successRequest({ meta: meta.multi, data: [] });
              functionCall().subscribe((data) => {
                expect(data).toEqual([]);
                done();
              }, shouldNotFail);
            });

            it("should handle response", (done) => {
              const response = { meta: meta.multi, data: responses.multi };
              successRequest(response);
              functionCall().subscribe((data) => {
                expect(data).toEqual(
                  response.data.map(
                    (model) => new MockModel(model, service["injector"])
                  )
                );
                done();
              }, shouldNotFail);
            });
          }

          it("should handle error response", (done) => {
            errorRequest(responses.error);
            functionCall().subscribe(shouldNotSucceed, (err) => {
              expect(err).toEqual(responses.error);
              done();
            });
          });

          it("should handle error info response", (done) => {
            errorRequest(responses.errorInfo);
            functionCall().subscribe(shouldNotSucceed, (err) => {
              expect(err).toEqual(responses.errorInfo);
              done();
            });
          });

          it("should complete on success", (done) => {
            if (singleResult) {
              successRequest({ meta: meta.single, data: responses.single });
            } else {
              successRequest({ meta: meta.multi, data: responses.multi });
            }

            functionCall().subscribe(noop, shouldNotFail, () => {
              expect(true).toBeTruthy();
              done();
            });
          });
        });
      }
    );
  });
});
