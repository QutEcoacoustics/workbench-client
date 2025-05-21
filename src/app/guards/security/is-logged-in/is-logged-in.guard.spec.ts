import { TestBed } from "@angular/core/testing";
import { CanActivateFn } from "@angular/router";
import { isLoggedInGuard } from "./is-logged-in.guard";

describe("isLoggedInGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isLoggedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });
});
