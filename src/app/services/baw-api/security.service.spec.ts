import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { SecurityService } from "./security.service";

describe("SecurityService", () => {
  let service: SecurityService;
  let httpMock: HttpTestingController;
  const url = "https://staging.ecosounds.org";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SecurityService]
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
    expect(service.getUser()).toBe(null);
  });

  // TODO FIXME Because this test runs asychronously, the other tests can affects the results
  it("getLoggedInTrigger should return false initially", () => {
    service.getLoggedInTrigger().subscribe(loggedIn => {
      expect(loggedIn).toBeFalsy();
    });
  });

  it("login should set session cookie", () => {
    service.login({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
      expect(JSON.parse(sessionStorage.getItem("user"))).toEqual({
        id: 12345,
        role: "User",
        authToken: "pUqyq5KDvZq24qSm8sy1",
        username: "Test"
      });
    });

    const req = httpMock.expectOne(url + "/security");
    expect(req.request.method).toBe("POST");
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
        auth_token: "pUqyq5KDvZq24qSm8sy1",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });
  });

  it("login should return error msg when already logged in", () => {
    service.login({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
      expect(JSON.parse(sessionStorage.getItem("user"))).toEqual({
        id: 12345,
        role: "User",
        authToken: "pUqyq5KDvZq24qSm8sy1",
        username: "Test"
      });
    });

    const req = httpMock.expectOne(url + "/security");

    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "pUqyq5KDvZq24qSm8sy1",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    service.login({ email: "email", password: "password" }).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    httpMock.expectNone(url + "/security");
  });

  it("login should return error on bad credentials", () => {
    service.login({ email: "email", password: "password" }).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/security");
    expect(req.request.method).toBe("POST");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );

    req.flush({
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
    });
  });

  it("login should return error on missing credentials", () => {
    service.login({ email: "email", password: "password" }).subscribe(
      res => {
        expect(res).toBeFalsy();
      },
      err => {
        expect(err).toBeTruthy();
        expect(typeof err).toBe("string");
      }
    );

    const req = httpMock.expectOne(url + "/security");
    expect(req.request.method).toBe("POST");
    expect(req.request.headers.has("Authorization")).toBeFalsy();
    expect(req.request.headers.has("Accept")).toBeTruthy();
    expect(req.request.headers.get("Accept")).toBeTruthy("application/json");
    expect(req.request.headers.has("Content-Type")).toBeTruthy();
    expect(req.request.headers.get("Content-Type")).toBeTruthy(
      "application/json"
    );

    req.flush({
      meta: {
        status: 400,
        message: "Bad Request",
        error: {
          details: "The request could not be verified.",
          info: null
        }
      },
      data: null
    });
  });

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

  it("logout should clear session cookie", () => {
    service.login({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
      expect(JSON.parse(sessionStorage.getItem("user"))).toEqual({
        id: 12345,
        role: "User",
        authToken: "pUqyq5KDvZq24qSm8sy1",
        username: "Test"
      });
    });

    const req = httpMock.expectOne(url + "/security");
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "pUqyq5KDvZq24qSm8sy1",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    service.logout();
    expect(service.getUser()).toBeFalsy();
  });

  it("logout should set isLoggedIn to false", () => {
    service.login({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
      expect(JSON.parse(sessionStorage.getItem("user"))).toEqual({
        id: 12345,
        role: "User",
        authToken: "pUqyq5KDvZq24qSm8sy1",
        username: "Test"
      });
    });

    const req = httpMock.expectOne(url + "/security");
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "pUqyq5KDvZq24qSm8sy1",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    service.logout();
    expect(service.isLoggedIn()).toBeFalsy();
  });

  it("logout should not crash when already logged out", () => {
    service.login({ email: "email", password: "password" }).subscribe(res => {
      expect(res).toBeTruthy();
      expect(sessionStorage.getItem("user")).toBeTruthy();
      expect(JSON.parse(sessionStorage.getItem("user"))).toEqual({
        id: 12345,
        role: "User",
        authToken: "pUqyq5KDvZq24qSm8sy1",
        username: "Test"
      });
    });

    const req = httpMock.expectOne(url + "/security");
    req.flush({
      meta: {
        status: 200,
        message: "OK"
      },
      data: {
        auth_token: "pUqyq5KDvZq24qSm8sy1",
        user_name: "Test",
        message: "Logged in successfully."
      }
    });

    service.logout();
    service.logout();
    expect(service.isLoggedIn()).toBeFalsy();
  });

  // TODO Implement the following tests
  xit("getLoggedInTrigger should trigger on login", () => {});

  xit("getLoggedInTrigger should trigger on register", () => {});

  xit("getLoggedInTrigger should trigger on logout", () => {});
});
