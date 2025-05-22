import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { loginRoute } from "@components/security/security.routes";
import { isLoggedInGuard } from "./is-logged-in.guard";

describe("isLoggedInGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isLoggedInGuard(...guardParameters));

  let isLoggedIn = false;
  let router: Router;
  let sessionService: BawSessionService;

  const route: ActivatedRouteSnapshot = {} as any;
  const state: RouterStateSnapshot = {
    url: "/consent-initiation",
  } as any;

  function setup(): void {
    TestBed.configureTestingModule({
      providers: [BawSessionService, Router],
    });

    sessionService = TestBed.inject(BawSessionService);
    spyOnProperty(sessionService, "isLoggedIn", "get").and.callFake(
      () => isLoggedIn,
    );

    router = TestBed.inject(Router);
  }

  beforeEach(() => {
    setup();
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });

  it("should return true if the user is logged in", async () => {
    isLoggedIn = true;

    const result = await executeGuard(route, state);

    expect(result).toBeTrue();
  });

  it("should navigate to the login page if the user is not logged in", async () => {
    isLoggedIn = false;
    const expectedRouterLocation = router.createUrlTree([loginRoute.toRouterLink()]);

    const result = await executeGuard(route, state);

    expect(result).toEqual(expectedRouterLocation);
  });
});
