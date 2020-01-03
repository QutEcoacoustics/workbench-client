import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { testAppInitializer } from "src/app/app.helper";
import { User } from "src/app/models/User";
import { AppConfigService } from "../app-config/app-config.service";
import { APIErrorDetails, BawApiInterceptor } from "./api.interceptor";
import { mockSessionStorage } from "./mock/sessionStorageMock";
import { SecurityService } from "./security.service";
import { UserService } from "./user.service";

describe("UserService", () => {
  let httpMock: HttpTestingController;
  let config: AppConfigService;
  let service: UserService;
  let securityService: SecurityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        BawApiInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: BawApiInterceptor,
          multi: true
        },
        ...testAppInitializer,
        SecurityService
      ]
    });

    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage
    });

    httpMock = TestBed.get(HttpTestingController);
    config = TestBed.get(AppConfigService);
    service = TestBed.get(UserService);
    securityService = TestBed.get(SecurityService);
  });

  afterEach(() => {
    sessionStorage.clear();
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  /**
   * Supplementary function to login account. This should never fail without tests
   * for security service also failing
   */
  function login() {
    securityService
      .signIn({ email: "email", password: "password" })
      // tslint:disable-next-line: rxjs-no-ignored-error
      .subscribe(() => {});

    const req = httpMock.expectOne(
      {
        url: config.getConfig().environment.apiRoot + "/security",
        method: "post"
      },
      "Supplementary function to login account. If this fails, test if unit test causes double login."
    );
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "xxxxxxxxxxxxxxxxxxxx",
        user_name: "username",
        message: "Logged in successfully."
      }
    });
  }

  it("getMyAccount should return error if user not logged in", done => {
    service.getMyAccount().subscribe(
      () => {
        expect(false).toBeTruthy("Should not produce response");
        done();
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "You need to log in or register before continuing."
        });
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/my_account"
    );
    req.flush(
      {
        meta: {
          status: 401,
          message: "Unauthorized",
          error: {
            details: "You need to log in or register before continuing.",
            info: null
          }
        },
        data: null
      },
      { status: 401, statusText: "Unauthorized" }
    );
  });

  it("getMyAccount should return details is user logged in", done => {
    login();

    service.getMyAccount().subscribe(
      resp => {
        expect(resp).toEqual(
          new User({
            id: 7,
            userName: "username",
            rolesMask: 2,
            timezoneInformation: null,
            rolesMaskNames: ["user"],
            imageUrls: [
              {
                size: "extralarge",
                url: "/images/user/user_span4.png",
                width: 300,
                height: 300
              }
            ],
            lastSeenAt: "2019-12-05T14:11:20.366+10:00",
            preferences: null,
            isConfirmed: true
          })
        );
      },
      () => {
        expect(false).toBeTruthy("Should not produce error response");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/my_account"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: {
        id: 7,
        user_name: "username",
        roles_mask: 2,
        timezone_information: null,
        roles_mask_names: ["user"],
        image_urls: [
          {
            size: "extralarge",
            url: "/images/user/user_span4.png",
            width: 300,
            height: 300
          }
        ],
        last_seen_at: "2019-12-05T14:11:20.366+10:00",
        preferences: null,
        isConfirmed: true
      }
    });
  });

  it("getUserAccount should return error if user is not logged in", done => {
    service.getUserAccount(1).subscribe(
      () => {
        expect(false).toBeTruthy("Should not produce response");
        done();
      },
      (err: APIErrorDetails) => {
        expect(err).toBeTruthy();
        expect(err).toEqual({
          status: 401,
          message: "You need to log in or register before continuing."
        });
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/user_accounts/1"
    );
    req.flush(
      {
        meta: {
          status: 401,
          message: "Unauthorized",
          error: {
            details: "You need to log in or register before continuing.",
            info: null
          }
        },
        data: null
      },
      { status: 401, statusText: "Unauthorized" }
    );
  });

  it("getUserAccount should return data if user is logged in", done => {
    login();

    service.getUserAccount(1).subscribe(
      resp => {
        expect(resp).toEqual(
          new User({
            id: 1,
            userName: "username",
            rolesMask: 2,
            timezoneInformation: null,
            rolesMaskNames: ["user"],
            imageUrls: [
              {
                size: "extralarge",
                url: "/images/user/user_span4.png",
                width: 300,
                height: 300
              }
            ],
            lastSeenAt: "2019-12-05T14:11:20.366+10:00",
            preferences: null,
            isConfirmed: true
          })
        );
      },
      () => {
        expect(false).toBeTruthy("Should not produce error response");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/user_accounts/1"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: {
        id: 1,
        user_name: "username",
        roles_mask: 2,
        timezone_information: null,
        roles_mask_names: ["user"],
        image_urls: [
          {
            size: "extralarge",
            url: "/images/user/user_span4.png",
            width: 300,
            height: 300
          }
        ],
        last_seen_at: "2019-12-05T14:11:20.366+10:00",
        preferences: null,
        isConfirmed: true
      }
    });
  });

  it("getUserAccount change request based on user id", done => {
    login();

    service.getUserAccount(5).subscribe(
      resp => {
        expect(resp).toEqual(
          new User({
            id: 5,
            userName: "username",
            rolesMask: 2,
            timezoneInformation: null,
            rolesMaskNames: ["user"],
            imageUrls: [
              {
                size: "extralarge",
                url: "/images/user/user_span4.png",
                width: 300,
                height: 300
              }
            ],
            lastSeenAt: "2019-12-05T14:11:20.366+10:00",
            preferences: null,
            isConfirmed: true
          })
        );
      },
      () => {
        expect(false).toBeTruthy("Should not produce error response");
        done();
      },
      () => {
        done();
      }
    );

    const req = httpMock.expectOne(
      config.getConfig().environment.apiRoot + "/user_accounts/5"
    );
    req.flush({
      meta: { status: 200, message: "OK" },
      data: {
        id: 5,
        user_name: "username",
        roles_mask: 2,
        timezone_information: null,
        roles_mask_names: ["user"],
        image_urls: [
          {
            size: "extralarge",
            url: "/images/user/user_span4.png",
            width: 300,
            height: 300
          }
        ],
        last_seen_at: "2019-12-05T14:11:20.366+10:00",
        preferences: null,
        isConfirmed: true
      }
    });
  });
});
