import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from "@angular/common/http/testing";
import { Injector } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  ApiErrorDetails,
  BawApiInterceptor,
} from "@baw-api/api.interceptor.service";
import {
  ApiResponse,
  BawApiService,
  Meta,
  STUB_MODEL_BUILDER,
} from "@baw-api/baw-api.service";
import { MockSecurityService } from "@baw-api/mock/securityMock.service";
import { SecurityService } from "@baw-api/security/security.service";
import { UserService } from "@baw-api/user/user.service";
import { AbstractModel } from "@models/AbstractModel";
import { SessionUser } from "@models/User";
import { AppConfigService } from "@services/app-config/app-config.service";
import { MockAppConfigModule } from "@services/app-config/app-configMock.module";
import { generateApiErrorDetails } from "@test/fakes/ApiErrorDetails";
import { BehaviorSubject, Subject } from "rxjs";
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

export const apiErrorDetails = generateApiErrorDetails("Unauthorized");

export const apiErrorInfoDetails = generateApiErrorDetails(
  "Unprocessable Entity",
  {
    message: "Record could not be saved",
    info: {
      name: ["has already been taken"],
      image: [],
      imageFileName: [],
      imageFileSize: [],
      imageContentType: [],
      imageUpdatedAt: [],
    },
  }
);

describe("BawApiService", () => {
  /**
   * Mock model interface
   */
  class MockModelInterface {
    public id?: number;
    public name?: string;
    public caseConversion?: {
      testConvert?: string;
    };
  }

  /**
   * Mock model to simulate abstract model
   */
  class MockModel extends AbstractModel {
    public readonly id?: number;
    public readonly name?: string;
    public readonly caseConversion?: {
      testConvert?: string;
    };

    public constructor(data: MockModelInterface, modelInjector: Injector) {
      super(data, modelInjector);
    }

    public toJSON() {
      return {
        id: this.id,
        name: this.name,
        caseConversion: this.caseConversion,
      };
    }

    public get viewUrl(): string {
      return "";
    }
  }

  let service: BawApiService<MockModel>;
  let env: AppConfigService;
  let httpMock: HttpTestingController;

  // Multi response metadata
  let multiMeta: Meta<MockModel>;

  // Single response metadata
  const singleMeta: Meta<MockModel> = { status: 200, message: "OK" };

  // Api error metadata
  const errorMeta: Meta = {
    status: apiErrorDetails.status,
    message: "Unauthorized",
    error: { details: apiErrorDetails.message },
  };

  // Api error metadata with info
  const errorInfoMeta: Meta = {
    status: apiErrorInfoDetails.status,
    message: "Unprocessable Entity",
    error: {
      details: apiErrorInfoDetails.message,
      info: {
        name: ["has already been taken"],
        image: [],
        imageFileName: [],
        imageFileSize: [],
        imageContentType: [],
        imageUpdatedAt: [],
      },
    },
  };

  // Single model response
  const singleResponse = {
    id: 1,
    name: "name",
    caseConversion: { testConvert: "converted" },
  };

  // Multi model response
  const multiResponse = [singleResponse];

  function signIn(authToken: string, userName: string) {
    const sessionUser = new SessionUser({ id: 1, authToken, userName });
    localStorage.setItem("baw.client.user", JSON.stringify(sessionUser));
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

  function catchRequest(route: string, method: string) {
    return httpMock.expectOne({
      url: env.environment.apiRoot + route,
      method,
    });
  }

  function verifyHeaders(req: TestRequest) {
    expect(req.request.headers.has("Accept")).toBeTruthy(
      "Request should contain Accept Headers"
    );
    expect(req.request.headers.get("Accept")).toBe("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy(
      "Request should contain Content-Type Headers"
    );
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
  }

  function verifyAuthHeaders(req: TestRequest, authToken: string) {
    verifyHeaders(req);
    expect(req.request.headers.has("Authorization")).toBeTruthy();
    expect(req.request.headers.get("Authorization")).toBe(
      `Token token="${authToken}"`
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MockAppConfigModule],
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
    service = TestBed.inject(BawApiService);
    env = TestBed.inject(AppConfigService);
    httpMock = TestBed.inject(HttpTestingController);

    multiMeta = {
      status: 200,
      message: "OK",
      sorting: {
        orderBy: "name",
        direction: "asc",
      },
      paging: {
        page: 1,
        items: 1,
        total: 1,
        maxPage: 1,
      },
    };
  });

  afterEach(() => {
    localStorage.clear();
    httpMock.verify();
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
      signIn("xxxxxxxxxxxxxxx", "username");
      expect(service.isLoggedIn()).toBeTruthy();
    });

    it("should return user after user saved to local storage", () => {
      signIn("xxxxxxxxxxxxxxx", "username");
      expect(service.getLocalUser().authToken).toBe("xxxxxxxxxxxxxxx");
      expect(service.getLocalUser().userName).toBe("username");
    });

    it("should not be logged in after user removed from local storage", () => {
      signIn("xxxxxxxxxxxxxxx", "username");
      signOut();
      expect(service.isLoggedIn()).toBe(false);
    });

    it("should not return user after user removed from local storage", () => {
      signIn("xxxxxxxxxxxxxxx", "username");
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
      {
        functionName: "httpGet",
        method: "GET",
        hasBody: false,
      },
      {
        functionName: "httpPost",
        method: "POST",
        hasBody: true,
      },
      {
        functionName: "httpPatch",
        method: "PATCH",
        hasBody: true,
      },
      {
        functionName: "httpDelete",
        method: "DELETE",
        hasBody: false,
      },
    ];

    httpMethods.forEach((httpMethod) => {
      describe(httpMethod.functionName, () => {
        it(`should create ${httpMethod.method} request`, () => {
          service[httpMethod.functionName]("/broken_link").subscribe();
          const req = catchRequest("/broken_link", httpMethod.method);
          expect(req).toBeTruthy();
        });

        it("should create request with baw server headers", () => {
          service[httpMethod.functionName]("/broken_link").subscribe();
          const req = catchRequest("/broken_link", httpMethod.method);
          verifyHeaders(req);
        });

        it("should create request with authenticated baw server headers", () => {
          signIn("xxxxxxxxxxxxxxx", "username");
          service[httpMethod.functionName]("/broken_link").subscribe();
          const req = catchRequest("/broken_link", httpMethod.method);
          verifyAuthHeaders(req, "xxxxxxxxxxxxxxx");
        });

        it("should return single response", () => {
          const response = {
            meta: singleMeta,
            data: singleResponse,
          } as ApiResponse<MockModel>;

          service[httpMethod.functionName]("/broken_link", {}).subscribe(
            (data: ApiResponse<MockModel>) => expect(data).toEqual(response),
            shouldNotFail
          );

          const req = catchRequest("/broken_link", httpMethod.method);
          flushResponse<MockModel>(req, response);
        });

        it("should return multi response", () => {
          const response = {
            meta: singleMeta,
            data: [singleResponse],
          } as ApiResponse<MockModel[]>;

          service[httpMethod.functionName]("/broken_link", {}).subscribe(
            (data: ApiResponse<MockModel[]>) => expect(data).toEqual(response),
            shouldNotFail
          );

          const req = catchRequest("/broken_link", httpMethod.method);
          flushResponse<MockModel[]>(req, response);
        });

        it("should handle error response", () => {
          const response = {
            meta: errorMeta,
            data: null,
          } as ApiResponse<MockModel>;

          service[httpMethod.functionName](
            "/broken_link",
            {}
          ).subscribe(shouldNotSucceed, (err: ApiErrorDetails) =>
            expect(err).toEqual(apiErrorDetails)
          );

          const req = catchRequest("/broken_link", httpMethod.method);
          flushResponse<MockModel>(req, response);
        });

        it("should handle error response with info", () => {
          const response = {
            meta: errorInfoMeta,
            data: null,
          } as ApiResponse<MockModel>;

          service[httpMethod.functionName](
            "/broken_link",
            {}
          ).subscribe(shouldNotSucceed, (err: ApiErrorDetails) =>
            expect(err).toEqual(apiErrorInfoDetails)
          );

          const req = catchRequest("/broken_link", httpMethod.method);
          flushResponse<MockModel>(req, response);
        });

        it("should complete on success", (done) => {
          const response = {
            meta: singleMeta,
            data: singleResponse,
          } as ApiResponse<MockModel>;

          service[httpMethod.functionName]("/broken_link", {}).subscribe(
            () => {},
            shouldNotFail,
            () => {
              expect(true).toBeTruthy();
              done();
            }
          );

          const req = catchRequest("/broken_link", httpMethod.method);
          flushResponse<MockModel>(req, response);
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
    function errorRequest(
      method: "httpGet" | "httpDelete" | "httpPost" | "httpPatch",
      error: ApiErrorDetails
    ) {
      return spyOn(service as any, method).and.callFake(() => {
        const subject = new Subject<ApiResponse<MockModel[]>>();
        subject.error(error);
        return subject;
      });
    }

    function successRequest<T>(
      method: "httpGet" | "httpDelete" | "httpPost" | "httpPatch",
      response: ApiResponse<T>
    ): jasmine.Spy {
      return spyOn(service as any, method).and.callFake(() => {
        const subject = new BehaviorSubject<ApiResponse<T>>(response);
        setTimeout(() => subject.complete(), 0);
        return subject;
      });
    }

    describe("apiList", () => {
      it("should call httpGet", () => {
        const response = {
          meta: multiMeta,
          data: [],
        } as ApiResponse<MockModel[]>;
        const spy = successRequest("httpGet", response);

        service["apiList"]("/broken_link").subscribe();
        expect(spy).toHaveBeenCalledWith("/broken_link");
      });

      it("should handle empty response", () => {
        const response = {
          meta: multiMeta,
          data: [],
        } as ApiResponse<MockModel[]>;
        successRequest("httpGet", response);

        service["apiList"]("/broken_link").subscribe((data) => {
          expect(data).toEqual([]);
        }, shouldNotFail);
      });

      it("should handle response", () => {
        const response = {
          meta: multiMeta,
          data: multiResponse,
        } as ApiResponse<MockModel[]>;
        successRequest("httpGet", response);

        service["apiList"]("/broken_link").subscribe((data) => {
          expect(data).toEqual(
            multiResponse.map(
              (model) => new MockModel(model, service["injector"])
            )
          );
        }, shouldNotFail);
      });

      it("should handle error response", () => {
        errorRequest("httpGet", apiErrorDetails);

        service["apiList"]("/broken_link").subscribe(
          shouldNotSucceed,
          (err: ApiErrorDetails) => {
            expect(err).toEqual(apiErrorDetails);
          }
        );
      });

      it("should handle error info response", () => {
        errorRequest("httpGet", apiErrorInfoDetails);

        service["apiList"]("/broken_link").subscribe(
          shouldNotSucceed,
          (err: ApiErrorDetails) => {
            expect(err).toEqual(apiErrorInfoDetails);
          }
        );
      });

      it("should complete on success", (done) => {
        const response = {
          meta: multiMeta,
          data: multiResponse,
        } as ApiResponse<MockModel[]>;
        successRequest("httpGet", response);

        service["apiList"]("/broken_link").subscribe(
          () => {},
          shouldNotFail,
          () => {
            expect(true).toBeTruthy();
            done();
          }
        );
      });
    });

    describe("apiFilter", () => {
      it("should call httpPost", () => {
        const response = {
          meta: multiMeta,
          data: multiResponse,
        } as ApiResponse<MockModel[]>;
        const spy = successRequest("httpPost", response);

        service["apiFilter"]("/broken_link", {}).subscribe();
        expect(spy).toHaveBeenCalledWith("/broken_link", {});
      });

      it("should call httpPost with body", () => {
        const response = {
          meta: multiMeta,
          data: multiResponse,
        } as ApiResponse<MockModel[]>;
        const spy = successRequest("httpPost", response);

        service["apiFilter"]("/broken_link", {
          paging: { items: 3 },
        }).subscribe();
        expect(spy).toHaveBeenCalledWith("/broken_link", {
          paging: { items: 3 },
        });
      });

      it("should handle response", () => {
        const response = {
          meta: multiMeta,
          data: multiResponse,
        } as ApiResponse<MockModel[]>;
        successRequest("httpPost", response);

        service["apiFilter"]("/broken_link", {}).subscribe((data) => {
          expect(data).toEqual([
            new MockModel(singleResponse, service["injector"]),
          ]);
        }, shouldNotFail);
      });

      it("should handle error response", () => {
        errorRequest("httpPost", apiErrorDetails);

        service["apiFilter"]("/broken_link", {}).subscribe(
          shouldNotSucceed,
          (err: ApiErrorDetails) => {
            expect(err).toEqual(apiErrorDetails);
          }
        );
      });

      it("should handle error info response", () => {
        errorRequest("httpPost", apiErrorInfoDetails);

        service["apiFilter"]("/broken_link", {}).subscribe(
          shouldNotSucceed,
          (err: ApiErrorDetails) => {
            expect(err).toEqual(apiErrorInfoDetails);
          }
        );
      });

      it("should complete on success", (done) => {
        const response = {
          meta: multiMeta,
          data: multiResponse,
        } as ApiResponse<MockModel[]>;
        successRequest("httpPost", response);

        service["apiFilter"]("/broken_link", {}).subscribe(
          () => {},
          shouldNotFail,
          () => {
            expect(true).toBeTruthy();
            done();
          }
        );
      });
    });

    describe("apiShow", () => {
      it("should call httpGet", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        const spy = successRequest("httpGet", response);

        service["apiShow"]("/broken_link").subscribe();
        expect(spy).toHaveBeenCalledWith("/broken_link");
      });

      it("should handle response", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        successRequest("httpGet", response);

        service["apiShow"]("/broken_link").subscribe((data) => {
          expect(data).toEqual(
            new MockModel(singleResponse, service["injector"])
          );
        }, shouldNotFail);
      });

      it("should handle error response", () => {
        errorRequest("httpGet", apiErrorDetails);

        service["apiShow"]("/broken_link").subscribe(
          shouldNotSucceed,
          (err: ApiErrorDetails) => {
            expect(err).toEqual(apiErrorDetails);
          }
        );
      });

      it("should handle error info response", () => {
        errorRequest("httpGet", apiErrorInfoDetails);

        service["apiShow"]("/broken_link").subscribe(
          shouldNotSucceed,
          (err: ApiErrorDetails) => {
            expect(err).toEqual(apiErrorInfoDetails);
          }
        );
      });

      it("should complete on success", (done) => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        successRequest("httpGet", response);

        service["apiShow"]("/broken_link").subscribe(
          () => {},
          shouldNotFail,
          () => {
            expect(true).toBeTruthy();
            done();
          }
        );
      });
    });

    describe("apiCreate", () => {
      it("should call httpPost", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        const spy = successRequest("httpPost", response);

        service["apiCreate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe();
        expect(spy).toHaveBeenCalledWith("/broken_link", {
          id: undefined,
          name: undefined,
          caseConversion: undefined,
        });
      });

      it("should call httpPost with body", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        const spy = successRequest("httpPost", response);

        service["apiCreate"](
          "/broken_link",
          new MockModel(
            {
              name: "Custom Name",
            },
            service["injector"]
          )
        ).subscribe();
        expect(spy).toHaveBeenCalledWith("/broken_link", {
          id: undefined,
          name: "Custom Name",
          caseConversion: undefined,
        });
      });

      it("should handle response", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        successRequest("httpPost", response);

        service["apiCreate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe((data) => {
          expect(data).toEqual(
            new MockModel(singleResponse, service["injector"])
          );
        }, shouldNotFail);
      });

      it("should handle error response", () => {
        errorRequest("httpPost", apiErrorDetails);

        service["apiCreate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toEqual(apiErrorDetails);
        });
      });

      it("should handle error info response", () => {
        errorRequest("httpPost", apiErrorInfoDetails);

        service["apiCreate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toEqual(apiErrorInfoDetails);
        });
      });

      it("should complete on success", (done) => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        successRequest("httpPost", response);

        service["apiCreate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe(
          () => {},
          shouldNotFail,
          () => {
            expect(true).toBeTruthy();
            done();
          }
        );
      });
    });

    describe("apiUpdate", () => {
      it("should call httpPatch", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        const spy = successRequest("httpPatch", response);

        service["apiUpdate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe();
        expect(spy).toHaveBeenCalledWith("/broken_link", {
          id: undefined,
          name: undefined,
          caseConversion: undefined,
        });
      });

      it("should call httpPost with body", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        const spy = successRequest("httpPatch", response);

        service["apiUpdate"](
          "/broken_link",
          new MockModel(
            {
              name: "Custom Name",
            },
            service["injector"]
          )
        ).subscribe();
        expect(spy).toHaveBeenCalledWith("/broken_link", {
          id: undefined,
          name: "Custom Name",
          caseConversion: undefined,
        });
      });

      it("should handle response", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        successRequest("httpPatch", response);

        service["apiUpdate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe((data) => {
          expect(data).toEqual(
            new MockModel(singleResponse, service["injector"])
          );
        }, shouldNotFail);
      });

      it("should handle error response", () => {
        errorRequest("httpPatch", apiErrorDetails);

        service["apiUpdate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toEqual(apiErrorDetails);
        });
      });

      it("should handle error info response", () => {
        errorRequest("httpPatch", apiErrorInfoDetails);

        service["apiUpdate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe(shouldNotSucceed, (err: ApiErrorDetails) => {
          expect(err).toEqual(apiErrorInfoDetails);
        });
      });

      it("should complete on success", (done) => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        successRequest("httpPatch", response);

        service["apiUpdate"](
          "/broken_link",
          new MockModel({}, service["injector"])
        ).subscribe(
          () => {},
          shouldNotFail,
          () => {
            expect(true).toBeTruthy();
            done();
          }
        );
      });
    });

    describe("apiDestroy", () => {
      it("should call httpDelete", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        const spy = successRequest("httpDelete", response);

        service["apiDestroy"]("/broken_link").subscribe();
        expect(spy).toHaveBeenCalledWith("/broken_link");
      });

      it("should handle response", () => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        successRequest("httpDelete", response);

        service["apiDestroy"]("/broken_link").subscribe((data) => {
          expect(data).toBe(null);
        }, shouldNotFail);
      });

      it("should handle error response", () => {
        errorRequest("httpDelete", apiErrorDetails);

        service["apiDestroy"]("/broken_link").subscribe(
          shouldNotSucceed,
          (err: ApiErrorDetails) => {
            expect(err).toEqual(apiErrorDetails);
          }
        );
      });

      it("should handle error info response", () => {
        errorRequest("httpDelete", apiErrorInfoDetails);

        service["apiDestroy"]("/broken_link").subscribe(
          shouldNotSucceed,
          (err: ApiErrorDetails) => {
            expect(err).toEqual(apiErrorInfoDetails);
          }
        );
      });

      it("should complete on success", (done) => {
        const response = {
          meta: singleMeta,
          data: singleResponse,
        } as ApiResponse<MockModel>;
        successRequest("httpDelete", response);

        service["apiDestroy"]("/broken_link").subscribe(
          () => {},
          shouldNotFail,
          () => {
            expect(true).toBeTruthy();
            done();
          }
        );
      });
    });
  });
});
