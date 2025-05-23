import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { SecurityService } from "@baw-api/security/security.service";
import { loginRoute } from "@components/security/security.routes";
import { lastValueFrom } from "rxjs";

export const isLoggedInGuard: CanActivateFn = async () => {
  const sessionService = inject(BawSessionService);
  const securityService = inject(SecurityService);
  const router = inject(Router);

  // We use the "lastValueFrom" here so that this guard will wait until the
  // subject has completed.
  if (!securityService.doneFirstAuth) {
    await lastValueFrom(securityService.firstAuthAwait);
  }

  if (sessionService.isLoggedIn) {
    return true;
  }

  // by returning a url tree from this guard, the guard will navigate to the
  // login page if the user is not logged in.
  return router.createUrlTree([loginRoute.toRouterLink()]);
};
