import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { BawSessionService } from "@baw-api/baw-session.service";
import { loginRoute } from "@components/security/security.routes";

export const isLoggedInGuard: CanActivateFn = () => {
  const sessionService = inject(BawSessionService);
  const router = inject(Router);

  if (sessionService.isLoggedIn) {
    return true;
  }

  // by returning a url tree from this guard, the guard will navigate to the
  // login page if the user is not logged in.
  return router.createUrlTree([loginRoute.toRouterLink()]);
};
