import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { SessionUser } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { ApiCommon, STUB_CLASS_BUILDER } from "./api-common";
import { ApiErrorDetails, BawApiInterceptor } from "./api.interceptor";
import { ApiResponse, BawApiService } from "./base-api.service";
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
      imports: [HttpClientTestingModule],
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

  it("delete should work", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["delete"]("/broken_path").subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "DELETE"
    });
    expect(req).toBeTruthy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBe("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBe("application/json");

    req.flush(null, { status: 204, statusText: "No Content" });
  });

  it("delete should token when logged in", done => {
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
    service["delete"]("/broken_path").subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "DELETE"
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

    req.flush(null, { status: 204, statusText: "No Content" });
  });

  it("delete should complete observable", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["delete"]("/broken_path").subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
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
      method: "DELETE"
    });

    req.flush(null, { status: 204, statusText: "No Content" });
  });

  it("delete should handle error", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["delete"]("/broken_path").subscribe(
      () => {
        expect(true).toBeFalsy("Service should not generate data response");
      },
      (err: ApiErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "You must log in before accessing this resource"
        } as ApiErrorDetails);
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "DELETE"
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
      } as ApiResponse,
      { status: 401, statusText: "Unauthorized" }
    );
  });

  it("delete should handle error with info", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["delete"]("/broken_path").subscribe(
      () => {
        expect(true).toBeFalsy("Service should not generate data response");
      },
      (err: ApiErrorDetails) => {
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
        } as ApiErrorDetails);
        done();
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "DELETE"
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
      } as ApiResponse,
      { status: 422, statusText: "Unprocessable Entity" }
    );
  });

  it("delete should handle object output", done => {
    const service: ApiCommon<MockModel> = TestBed.get(ApiCommon);
    service["delete"]("/broken_path").subscribe(
      (success: boolean) => {
        expect(success).toBeTruthy();
        expect(success).toBeTrue();
        done();
      },
      () => {
        expect(true).toBeFalsy("Service should not generate error");
      }
    );

    const req = httpMock.expectOne({
      url: config.getConfig().environment.apiRoot + "/broken_path",
      method: "DELETE"
    });

    req.flush(null, { status: 204, statusText: "No Content" });
  });
});
