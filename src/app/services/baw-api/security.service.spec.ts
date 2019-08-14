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

  it("should have tests", () => {
    expect(false).toBeTruthy();
  });
});
