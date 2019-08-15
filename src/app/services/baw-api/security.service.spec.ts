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

  it("getLoggedInTrigger should return false initially", () => {
    expect(service.getLoggedInTrigger().getValue()).toBeFalsy();
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

  it("login should receive token", () => {});

  it("login should do nothing when already logged in", () => {});

  it("login should return error on bad password", () => {});

  it("login should return error on bad username", () => {});

  it("login should return error on bad credentials", () => {});

  it("login should return error on missing credentials", () => {});

  it("register should set session cookie", () => {});

  it("register should receive token", () => {});

  it("register should do nothing when already logged in", () => {});

  it("register should return error on bad password", () => {});

  it("register should return error on bad username", () => {});

  it("register should return error on bad credentials", () => {});

  it("register should return error on missing credentials", () => {});

  it("logout should clear session cookie", () => {});

  it("logout should do nothing when already logged out", () => {});

  it("getLoggedInTrigger should trigger on login", () => {});

  it("getLoggedInTrigger should trigger on register", () => {});

  it("getLoggedInTrigger should trigger on logout", () => {});
});
