import { TestBed } from "@angular/core/testing";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { loginRoute } from "@components/security/security.routes";
import { modelData } from "@test/helpers/faker";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { SecurityService } from "@baw-api/security/security.service";
import { isLoggedInGuard } from "./is-logged-in.guard";

describe("isLoggedInGuard", () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => isLoggedInGuard(...guardParameters));

  let isLoggedIn = false;
  let router: Router;
  let sessionService: BawSessionService;
  let securityService: SecurityService;

  const route: ActivatedRouteSnapshot = {} as any;
  const state: RouterStateSnapshot = {
    url: modelData.internet.url(),
  } as any;

  function setLoggedIn(newLoggedIn: boolean): void {
    isLoggedIn = newLoggedIn;

    securityService.doneFirstAuth = true;
    securityService.firstAuthAwait.next(state);
    securityService.firstAuthAwait.complete();
  }

  function setup(): void {
    TestBed.configureTestingModule({
      providers: [provideMockBawApi(), BawSessionService, Router],
    });

    securityService = TestBed.inject(SecurityService);
    router = TestBed.inject(Router);

    sessionService = TestBed.inject(BawSessionService);
    spyOnProperty(sessionService, "isLoggedIn", "get").and.callFake(
      () => isLoggedIn,
    );
  }

  beforeEach(() => {
    setup();
  });

  it("should be created", () => {
    expect(executeGuard).toBeTruthy();
  });

  it("should return true if the user is logged in", async () => {
    setLoggedIn(true);
    const result = await executeGuard(route, state);
    expect(result).toBeTrue();
  });

  it("should navigate to the login page if the user is not logged in", async () => {
    setLoggedIn(false);
    const expectedRouterLocation = router.createUrlTree([loginRoute.toRouterLink()]);

    const result = await executeGuard(route, state);

    expect(result).toEqual(expectedRouterLocation);
  });
});
