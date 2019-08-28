import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { BawApiService } from "./base-api.service";

describe("BawApiService", () => {
  let service: BawApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
    });
    service = TestBed.get(BawApiService);

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
    expect(service).toBeTruthy();
  });

  it("should not change session storage on first load", () => {
    expect(sessionStorage.length).toBe(0);
  });

  it("should not be logged in", () => {
    expect(service.isLoggedIn()).toBe(false);
  });

  it("should not return user", () => {
    expect(service.getUser()).toBe(null);
  });
});
