import { HTTP_INTERCEPTORS } from "@angular/common/http";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { BawApiInterceptor } from "./api.interceptor";
import { SecurityService } from "./security.service";

describe("SecurityService", () => {
  let service: SecurityService;
  let httpMock: HttpTestingController;
  const url = environment.bawApiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        SecurityService,
        { provide: HTTP_INTERCEPTORS, useClass: BawApiInterceptor, multi: true }
      ]
    });

    service = TestBed.get(SecurityService);
    httpMock = TestBed.get(HttpTestingController);

    const mockSessionStorage = (() => {
      let storage = {};
      return {
        getItem(key) {
          return storage[key];
        },
        removeItem(key) {
          delete storage[key];
        },
        setItem(key, value) {
          storage[key] = value.toString();
        },
        clear() {
          storage = {};
        },
        get length() {
          return Object.keys(storage).length;
        }
      };
    })();

    Object.defineProperty(window, "sessionStorage", {
      value: mockSessionStorage
    });
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("isLoggedIn should return false initially", () => {
    expect(service.isLoggedIn()).toBeFalsy();
  });

  it("getUser should return null initially", () => {
    expect(service.getSessionUser()).toBe(null);
  });

  it("login should set session cookie", () => {
    service.signIn({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
      expect(JSON.parse(sessionStorage.getItem("user"))).toEqual({
        authToken: "aaaaaaaaaaaaaaaaaaaaaa",
        userName: "Test"
      });
    });

    const req = httpMock.expectOne({
      url: url + "/security",
      method: "POST"
    });
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });
  });

  it("login should return error msg when already logged in", fakeAsync(() => {
    service.signIn({ email: "email", password: "password" }).subscribe(res => {
      console.log("User: ", JSON.parse(sessionStorage.getItem("user")));
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
      expect(JSON.parse(sessionStorage.getItem("user"))).toEqual({
        authToken: "aaaaaaaaaaaaaaaaaaaaaa",
        userName: "Test"
      });
    });

    const req = httpMock.expectOne({
      url: url + "/security",
      method: "POST"
    });

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    tick(2000);

    service.signIn({ email: "email", password: "password" }).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    httpMock.expectNone({
      url: url + "/security",
      method: "POST"
    });
  }));

  it("login should return error on bad credentials", () => {
    service.signIn({ email: "email", password: "password" }).subscribe(
      res => {
        expect(true).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne({
      url: url + "/security",
      method: "POST"
    });
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );

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

  it("login should return error on missing credentials", () => {
    service.signIn({ email: "email", password: "password" }).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne({
      url: url + "/security",
      method: "POST"
    });
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );

    req.flush(
      {
        meta: {
          status: 400,
          message: "Bad Request",
          error: {
            details: "The request could not be verified.",
            info: null
          }
        },
        data: null
      },
      { status: 400, statusText: "Bad Request" }
    );
  });

  it("logout should clear session cookie", fakeAsync(() => {
    service.signIn({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
    });

    const loginReq = httpMock.expectOne({
      url: url + "/security",
      method: "POST"
    });
    loginReq.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    service.signOut();

    const logoutReq = httpMock.expectOne({
      url: url + "/security",
      method: "DELETE"
    });
    logoutReq.flush({
      meta: {
        status: 200,
        message: "OK",
        error: {
          links: {
            "Log in": "/my_account/sign_in",
            Register: "/my_account/sign_up"
          },
          info: null
        }
      },
      data: {
        user_name: "Test",
        message: "Logged out successfully."
      }
    });

    expect(sessionStorage.getItem("user")).toBeFalsy();
  }));

  it("logout should set getUser to null", fakeAsync(() => {
    service.signIn({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
    });

    const req = httpMock.expectOne({
      url: url + "/security",
      method: "POST"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    service.signOut();

    const logoutReq = httpMock.expectOne({
      url: url + "/security",
      method: "DELETE"
    });
    logoutReq.flush({
      meta: {
        status: 200,
        message: "OK",
        error: {
          links: {
            "Log in": "/my_account/sign_in",
            Register: "/my_account/sign_up"
          },
          info: null
        }
      },
      data: {
        user_name: "Test",
        message: "Logged out successfully."
      }
    });

    expect(service.getSessionUser()).toBeFalsy();
  }));

  it("logout should set isLoggedIn to false", fakeAsync(() => {
    service.signIn({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
    });

    const req = httpMock.expectOne({
      url: url + "/security",
      method: "POST"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    service.signOut();

    const logoutReq = httpMock.expectOne({
      url: url + "/security",
      method: "DELETE"
    });
    logoutReq.flush({
      meta: {
        status: 200,
        message: "OK",
        error: {
          links: {
            "Log in": "/my_account/sign_in",
            Register: "/my_account/sign_up"
          },
          info: null
        }
      },
      data: {
        user_name: "Test",
        message: "Logged out successfully."
      }
    });

    expect(service.isLoggedIn()).toBeFalsy();
  }));

  it("logout should not crash when already logged out", fakeAsync(() => {
    service.signIn({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
    });

    const req = httpMock.expectOne({
      url: url + "/security",
      method: "POST"
    });
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "aaaaaaaaaaaaaaaaaaaaaa",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    service.signOut();

    const logoutReq = httpMock.expectOne({
      url: url + "/security",
      method: "DELETE"
    });
    logoutReq.flush({
      meta: {
        status: 200,
        message: "OK",
        error: {
          links: {
            "Log in": "/my_account/sign_in",
            Register: "/my_account/sign_up"
          },
          info: null
        }
      },
      data: {
        user_name: "Test",
        message: "Logged out successfully."
      }
    });

    service.signOut();

    httpMock.expectNone({
      url: url + "/security",
      method: "DELETE"
    });
    expect(service.isLoggedIn()).toBeFalsy();
  }));

  // TODO Implement the following tests
  xit("getLoggedInTrigger should return false initially", fakeAsync(() => {
    service.getLoggedInTrigger().subscribe(loggedIn => {
      expect(loggedIn).toBeFalsy();
    });
  }));

  xit("getLoggedInTrigger should trigger on login", () => {});

  xit("getLoggedInTrigger should trigger on register", () => {});

  xit("getLoggedInTrigger should trigger on logout", () => {});

  // TODO Implement when register route is completed
  xit("register should set session cookie", () => {
    expect(false).toBe(true);
  });

  xit("register should receive token", () => {
    expect(false).toBe(true);
  });

  xit("register should do nothing when already logged in", () => {
    expect(false).toBe(true);
  });

  xit("register should return error on bad password", () => {
    expect(false).toBe(true);
  });

  xit("register should return error on bad username", () => {
    expect(false).toBe(true);
  });

  xit("register should return error on bad credentials", () => {
    expect(false).toBe(true);
  });

  xit("register should return error on missing credentials", () => {
    expect(false).toBe(true);
  });
});
