import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { SecurityService } from "./security.service";

describe("SecurityService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });

    // Mock session storage
    const storageMock = () => {
      const storage = {};

      return {
        setItem(key, value) {
          storage[key] = value || "";
        },
        getItem(key) {
          return key in storage ? storage[key] : null;
        },
        removeItem(key) {
          delete storage[key];
        },
        get length() {
          return Object.keys(storage).length;
        },
        key(i) {
          const keys = Object.keys(storage);
          return keys[i] || null;
        }
      };
    };

    Object.defineProperty(window, "sessionStorage", {
      value: storageMock
    });
  });

  it("should be created", () => {
    const service: SecurityService = TestBed.get(SecurityService);
    expect(service).toBeTruthy();
  });

  it("should not be logged in initially", () => {});

  it("isLoggedIn should return false initially", () => {});

  it("getUser should return null initially", () => {});

  it("getLoggedInTrigger should return false initially", () => {});

  it("login should set session cookie", () => {});

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
