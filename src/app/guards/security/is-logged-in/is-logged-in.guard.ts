import { CanActivateFn } from "@angular/router";

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  return true;
};
