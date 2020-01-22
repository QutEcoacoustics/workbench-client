import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { testAppInitializer } from "src/app/app.helper";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiCommon, STUB_CLASS_BUILDER } from "./api-common";
import { APIErrorDetails, BawApiInterceptor } from "./api.interceptor";
import { APIResponse, BawApiService } from "./base-api.service";
import { MockBawApiService } from "./mock/baseApiMockService";

describe("ApiCommon List", () => {
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let bawApi: BawApiService;

  class MockModelInterface {
    id: number;
    name: string;
    caseConversion: {
      testConvert: string;
    };
  }

  class MockModel {
    id: number;
    name: string;
    caseConversion: {
      testConvert: string;
    };

    constructor(data: MockModelInterface) {
      this.id = data.id;
      this.name = data.name;
      this.caseConversion = data.caseConversion;
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ...testAppInitializer,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BawApiInterceptor,
          multi: true
        },
        { provide: BawApiService, useClass: MockBawApiService },
        {
          provide: STUB_CLASS_BUILDER,
          useValue: MockModel
        },
        ApiCommon
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    config = TestBed.get(AppConfigService);
    bawApi = TestBed.get(BawApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("list should work no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", null).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "GET"
    });
    expect(req).toBeTruthy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBe("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBe("application/json");

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should work with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", {}).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/filter",
      method: "POST"
    });
    expect(req).toBeTruthy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBe("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBe("application/json");

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should have token when logged in no filter", done => {
    spyOn(bawApi, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(bawApi, "getSessionUser").and.callFake(() => {
      return new SessionUser({
        authToken: "xxxxxxxxxxxxxxx",
        userName: "username"
      });
    });

    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", null).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "GET"
    });
    expect(req).toBeTruthy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBe("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
    expect(req.request.headers.has("Authorization")).toBeTruthy();
    expect(req.request.headers.get("Authorization")).toBe(
      'Token token="xxxxxxxxxxxxxxx"'
    );

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should have token when logged in with filter", done => {
    spyOn(bawApi, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(bawApi, "getSessionUser").and.callFake(() => {
      return new SessionUser({
        authToken: "xxxxxxxxxxxxxxx",
        userName: "username"
      });
    });

    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", {}).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/filter",
      method: "POST"
    });
    expect(req).toBeTruthy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBe("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
    expect(req.request.headers.has("Authorization")).toBeTruthy();
    expect(req.request.headers.get("Authorization")).toBe(
      'Token token="xxxxxxxxxxxxxxx"'
    );

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should work with single argument no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path/:id", null, 1).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/1",
      method: "GET"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should work with single argument with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path/:id", {}, 1).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/1/filter",
      method: "POST"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should work with multiple arguments no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path/:id/extra/:extraId", null, 1, 5).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/1/extra/5",
      method: "GET"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should work with multiple arguments with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path/:id/extra/:extraId", {}, 1, 5).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url:
        config.getConfig().environment.apiRoot +
        "/broken_path/1/extra/5/filter",
      method: "POST"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should complete observable no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", null).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "GET"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should complete observable with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", {}).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/filter",
      method: "POST"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should handle error no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", null).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not generate data response");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "You must log in before accessing this resource"
        } as APIErrorDetails);
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "GET"
    });

    req.flush(
      {
        meta: {
          status: 401,
          message: "Unauthorized",
          error: {
            details: "You must log in before accessing this resource"
          }
        },
        data: null
      } as APIResponse,
      { status: 401, statusText: "Unauthorized" }
    );
  });

  it("list should handle error with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", {}).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not generate data response");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "You must log in before accessing this resource"
        } as APIErrorDetails);
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/filter",
      method: "POST"
    });

    req.flush(
      {
        meta: {
          status: 401,
          message: "Unauthorized",
          error: {
            details: "You must log in before accessing this resource"
          }
        },
        data: null
      } as APIResponse,
      { status: 401, statusText: "Unauthorized" }
    );
  });

  it("list should handle error with info no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", null).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not generate data response");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 422,
          message: "Record could not be saved",
          info: {
            name: ["has already been taken"],
            image: [],
            image_file_name: [],
            image_file_size: [],
            image_content_type: [],
            image_updated_at: []
          }
        } as APIErrorDetails);
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "GET"
    });

    req.flush(
      {
        meta: {
          status: 422,
          message: "Unprocessable Entity",
          error: {
            details: "Record could not be saved",
            info: {
              name: ["has already been taken"],
              image: [],
              image_file_name: [],
              image_file_size: [],
              image_content_type: [],
              image_updated_at: []
            }
          }
        },
        data: null
      } as APIResponse,
      { status: 422, statusText: "Unprocessable Entity" }
    );
  });

  it("list should handle error with info with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", {}).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not generate data response");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 422,
          message: "Record could not be saved",
          info: {
            name: ["has already been taken"],
            image: [],
            image_file_name: [],
            image_file_size: [],
            image_content_type: [],
            image_updated_at: []
          }
        } as APIErrorDetails);
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/filter",
      method: "POST"
    });

    req.flush(
      {
        meta: {
          status: 422,
          message: "Unprocessable Entity",
          error: {
            details: "Record could not be saved",
            info: {
              name: ["has already been taken"],
              image: [],
              image_file_name: [],
              image_file_size: [],
              image_content_type: [],
              image_updated_at: []
            }
          }
        },
        data: null
      } as APIResponse,
      { status: 422, statusText: "Unprocessable Entity" }
    );
  });

  it("list should handle empty object output no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", null).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        expect(user).toEqual([]);
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "GET"
    });

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should handle empty object output with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", {}).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        expect(user).toEqual([]);
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/filter",
      method: "POST"
    });
    expect(req).toBeTruthy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBe("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBe("application/json");

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: []
    } as APIResponse);
  });

  it("list should handle error on missing output no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", null).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not generate data response");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: -1,
          message: "No data returned from API"
        } as APIErrorDetails);
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "GET"
    });

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: null
    } as APIResponse);
  });

  it("list should handle error on missing output with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", {}).subscribe(
      () => {
        expect(true).toBeFalsy("Service should not generate data response");
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: -1,
          message: "No data returned from API"
        } as APIErrorDetails);
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/filter",
      method: "POST"
    });

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: null
    } as APIResponse);
  });

  it("list should handle single object output no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", null).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        expect(user).toEqual([
          new MockModel({
            id: 1,
            name: "name",
            caseConversion: {
              testConvert: "test"
            }
          })
        ]);
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "GET"
    });

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: [
        {
          id: 1,
          name: "name",
          case_conversion: {
            test_convert: "test"
          }
        }
      ]
    } as APIResponse);
  });

  it("list should handle single object output with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", {}).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        expect(user).toEqual([
          new MockModel({
            id: 1,
            name: "name",
            caseConversion: {
              testConvert: "test"
            }
          })
        ]);
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/filter",
      method: "POST"
    });
    expect(req).toBeTruthy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBe("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBe("application/json");

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: [
        {
          id: 1,
          name: "name",
          case_conversion: {
            test_convert: "test"
          }
        }
      ]
    } as APIResponse);
  });

  it("list should handle multiple object output no filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", null).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        expect(user).toEqual([
          new MockModel({
            id: 1,
            name: "name 1",
            caseConversion: {
              testConvert: "test 1"
            }
          }),
          new MockModel({
            id: 5,
            name: "name 2",
            caseConversion: {
              testConvert: "test 2"
            }
          })
        ]);
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "GET"
    });

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: [
        {
          id: 1,
          name: "name 1",
          case_conversion: {
            test_convert: "test 1"
          }
        },
        {
          id: 5,
          name: "name 2",
          case_conversion: {
            test_convert: "test 2"
          }
        }
      ]
    } as APIResponse);
  });

  it("list should handle multiple object output with filter", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["list"]("/broken_path", {}).subscribe(
      (user: MockModel[]) => {
        expect(user).toBeTruthy();
        expect(user).toEqual([
          new MockModel({
            id: 1,
            name: "name 1",
            caseConversion: {
              testConvert: "test 1"
            }
          }),
          new MockModel({
            id: 5,
            name: "name 2",
            caseConversion: {
              testConvert: "test 2"
            }
          })
        ]);
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path/filter",
      method: "POST"
    });

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: [
        {
          id: 1,
          name: "name 1",
          case_conversion: {
            test_convert: "test 1"
          }
        },
        {
          id: 5,
          name: "name 2",
          case_conversion: {
            test_convert: "test 2"
          }
        }
      ]
    } as APIResponse);
  });
});
