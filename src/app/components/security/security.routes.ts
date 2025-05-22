import { StrongRoute } from "@interfaces/strongRoute";

export const securityRoute = StrongRoute.newRoot().add("security");
export const loginRoute = securityRoute.add("login");
export const registerRoute = securityRoute.add("register");
export const confirmAccountRoute = securityRoute.add("confirmation");
export const resetPasswordRoute = securityRoute.add("reset_password");
export const unlockAccountRoute = securityRoute.add("unlock_account");
