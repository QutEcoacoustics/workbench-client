import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
  HttpParams
} from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testBawServices } from "src/app/app.helper";
import { environment } from "src/environments/environment";
import { BawApiInterceptor } from "./api.interceptor";
import { BawApiService } from "./base-api.service";

describe("BawApiInterceptor", () => {
  let api: BawApiService;
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
      providers: [
        BawApiInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BawApiInterceptor,
          multi: true
        },
        ...testBawServices
      ]
    });

    api = TestBed.get(BawApiService);
    http = TestBed.get(HttpClient);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    const service: BawApiService = TestBed.get(BawApiService);
    expect(service).toBeTruthy();
  });

  it("should handle api error response", done => {
    const noop = () => {
      done();
    };

    http.get<any>(environment.bawApiUrl + "/brokenapiroute").subscribe(
      data => {
        expect(false).toBeTruthy("HTTP Error Responses should not return data");
        done();
      },
      err => {
        expect(err).toEqual({
          status: 401,
          message:
            "Incorrect user name, email, or password. Alternatively, you may need to confirm your account or it may be locked."
        });
        done();
      },
      noop
    );
    const req = httpMock.expectOne(environment.bawApiUrl + "/brokenapiroute");

    req.flush(
      {
        meta: {
          status: 401,
          message: "Unauthorized",
          error: {
            details:
              "Incorrect user name, email, or password. Alternatively, you may need to confirm your account or it may be locked.",
            links: {
              "Confirm account": "/my_account/confirmation/new",
              "Reset password": "/my_account/password/new",
              "Unlock account": "/my_account/unlock/new"
            },
            info: null
          }
        },
        data: null
      },
      { status: 401, statusText: "Unauthorized" }
    );
  });

  it("should handle http error response", done => {
    const noop = () => {
      done();
    };

    http.get<any>(environment.bawApiUrl + "/brokenapiroute").subscribe(
      data => {
        expect(false).toBeTruthy("HTTP Error Responses should not return data");
        done();
      },
      err => {
        expect(err).toEqual({
          status: 404,
          message: `Http failure response for ${environment.bawApiUrl}/brokenapiroute: 404 Page Not Found`
        });
        done();
      },
      noop
    );
    const req = httpMock.expectOne(environment.bawApiUrl + "/brokenapiroute");

    req.flush({}, { status: 404, statusText: "Page Not Found" });
  });

  it("should not set accept header on outgoing data to non baw api traffic", () => {
    const noop = () => {};

    http.get<any>("https://brokenlink").subscribe(noop, noop, noop);
    const req = httpMock.expectOne("https://brokenlink");

    expect(req.request.headers.has("Accept")).toBeFalsy();
  });

  it("should not set token header on outgoing data to non baw api traffic when not logged in", () => {
    const noop = () => {};

    http.get<any>("https://brokenlink").subscribe(noop, noop, noop);
    const req = httpMock.expectOne("https://brokenlink");

    expect(req.request.headers.has("Token")).toBeFalsy();
  });

  it("should not set token header on outgoing data to non baw api traffic when logged in", () => {
    const noop = () => {};

    spyOn(api, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(api, "getSessionUser").and.callFake(() => {
      return {
        authToken: "xxxxxxxxxxxxxxxxxxxx",
        userName: "username"
      };
    });

    http.get<any>("https://brokenlink").subscribe(noop, noop, noop);
    const req = httpMock.expectOne("https://brokenlink");

    expect(req.request.headers.has("Authorization")).toBeFalsy();
  });

  it("should not set content-type header on outgoing data to non baw api traffic", () => {
    const noop = () => {};

    http.get<any>("https://brokenlink").subscribe(noop, noop, noop);
    const req = httpMock.expectOne("https://brokenlink");

    expect(req.request.headers.has("Content-Type")).toBeFalsy();
  });

  it("should not convert outgoing data to non baw api traffic into snake case for GET requests", () => {
    const noop = () => {};
    const params = new HttpParams().set("shouldNotConvert", "true");

    http
      .get<any>("https://brokenlink/brokenapiroute", { params })
      .subscribe(noop, noop, noop);

    const req = httpMock.expectOne(
      "https://brokenlink/brokenapiroute?shouldNotConvert=true"
    );

    expect(req).toBeTruthy();
  });

  it("should not convert outgoing data to non baw api traffic into snake case for POST requests", () => {
    const noop = () => {};

    http
      .post<any>("https://brokenlink/brokenapiroute", {
        shouldNotConvert: true
      })
      .subscribe(noop, noop, noop);

    const req = httpMock.expectOne("https://brokenlink/brokenapiroute");

    expect(req.request.body).toEqual({ shouldNotConvert: true });
  });

  it("should not convert incoming data from non baw api traffic into camel case for GET requests", done => {
    const noop = () => {
      done();
    };

    http.get<any>("https://brokenlink/brokenapiroute").subscribe(
      response => {
        expect(response).toBeTruthy();
        expect(response).toEqual({ dummy_response: true });
        done();
      },
      noop,
      noop
    );

    const req = httpMock.expectOne("https://brokenlink/brokenapiroute");
    req.flush({ dummy_response: true });
  });

  it("should not convert incoming data from non baw api traffic into camel case for POST requests", done => {
    const noop = () => {};

    http.post<any>("https://brokenlink/brokenapiroute", {}).subscribe(
      response => {
        expect(response).toBeTruthy();
        expect(response).toEqual({ dummy_response: true });
        done();
      },
      noop,
      noop
    );

    const req = httpMock.expectOne("https://brokenlink/brokenapiroute");
    req.flush({ dummy_response: true });
  });

  it("should set accept header on outgoing data to baw api", () => {
    const noop = () => {};

    http
      .get<any>(environment.bawApiUrl + "/brokenapiroute")
      .subscribe(noop, noop, noop);
    const req = httpMock.expectOne(environment.bawApiUrl + "/brokenapiroute");

    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBe("application/json");
  });

  it("should set content-type header on outgoing data to baw api", () => {
    const noop = () => {};

    http
      .get<any>(environment.bawApiUrl + "/brokenapiroute")
      .subscribe(noop, noop, noop);
    const req = httpMock.expectOne(environment.bawApiUrl + "/brokenapiroute");

    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBe("application/json");
  });

  it("should convert outgoing data to baw api into snake case for GET requests", () => {
    const noop = () => {};
    const params = new HttpParams().set("shouldConvert", "true");

    http
      .get<any>(environment.bawApiUrl + "/brokenapiroute", { params })
      .subscribe(noop, noop, noop);

    const req = httpMock.expectOne(
      environment.bawApiUrl + "/brokenapiroute?should_convert=true"
    );

    expect(req).toBeTruthy();
  });

  it("should convert outgoing data to baw api into snake case for POST requests", () => {
    const noop = () => {};

    http
      .post<any>(environment.bawApiUrl + "/brokenapiroute", {
        shouldConvert: true
      })
      .subscribe(noop, noop, noop);

    const req = httpMock.expectOne(environment.bawApiUrl + "/brokenapiroute");

    expect(req.request.body).toEqual({ should_convert: true });
  });

  it("should convert incoming data from baw api into camel case for GET requests", done => {
    const noop = () => {
      done();
    };

    http.get<any>(environment.bawApiUrl + "/brokenapiroute").subscribe(
      response => {
        expect(response).toBeTruthy();
        expect(response).toEqual({ dummyResponse: true });
        done();
      },
      noop,
      noop
    );

    const req = httpMock.expectOne(environment.bawApiUrl + "/brokenapiroute");
    req.flush({ dummy_response: true });
  });

  it("should convert incoming data from baw api into camel case for POST requests", done => {
    const noop = () => {
      done();
    };

    http.post<any>(environment.bawApiUrl + "/brokenapiroute", {}).subscribe(
      response => {
        expect(response).toBeTruthy();
        expect(response).toEqual({ dummyResponse: true });
        done();
      },
      noop,
      noop
    );

    const req = httpMock.expectOne(environment.bawApiUrl + "/brokenapiroute");
    req.flush({ dummy_response: true });
  });

  it("should not attach token to baw api requests when unauthenticated", () => {
    const noop = () => {};

    http
      .get<any>(environment.bawApiUrl + "/brokenapiroute")
      .subscribe(noop, noop, noop);
    const req = httpMock.expectOne(environment.bawApiUrl + "/brokenapiroute");

    expect(req.request.headers.has("Authorization")).toBeFalsy();
  });

  it("should attach token to baw api requests when authenticated", () => {
    const noop = () => {};

    spyOn(api, "isLoggedIn").and.callFake(() => {
      return true;
    });
    spyOn(api, "getSessionUser").and.callFake(() => {
      return {
        authToken: "xxxxxxxxxxxxxxxxxxxx",
        userName: "username"
      };
    });

    http
      .get<any>(environment.bawApiUrl + "/brokenapiroute")
      .subscribe(noop, noop, noop);
    const req = httpMock.expectOne(environment.bawApiUrl + "/brokenapiroute");

    expect(req.request.headers.has("Authorization")).toBeTruthy();
    expect(req.request.headers.get("Authorization")).toBe(
      'Token token="xxxxxxxxxxxxxxxxxxxx"'
    );
  });

  // TODO Implement this test after baw api uri has been removed to external config
  xit("should change baw api uri based on environment", () => {});
});
