import { Category, MenuRoute } from "src/app/interfaces/menusInterfaces";
import { StrongRoute } from "src/app/interfaces/strongRoute";

export const securityRoute = StrongRoute.Base.add("security");

export const securityCategory: Category = {
  icon: ["fas", "user"],
  label: "Accounts",
  route: securityRoute
};

export const confirmAccountMenuItem = MenuRoute({
  icon: ["fas", "envelope"],
  label: "Confirm account",
  route: securityRoute.add("confirmation"),
  tooltip: () => "Resend the email to confirm your account",
  order: { priority: 2, indentation: 1 }
});

export const loginMenuItem = MenuRoute({
  icon: ["fas", "sign-in-alt"],
  label: "Log in",
  tooltip: () => "Log into the website",
  route: securityRoute.add("login"),
  predicate: user => !user,
  order: { priority: 2, indentation: 0 }
});

export const registerMenuItem = MenuRoute({
  icon: ["fas", "user-plus"],
  label: "Register",
  route: securityRoute.add("register"),
  tooltip: () => "Create an account",
  predicate: user => !user,
  order: { priority: 3, indentation: 0 }
});

export const resetPasswordMenuItem = MenuRoute({
  icon: ["fas", "key"],
  label: "Reset password",
  route: securityRoute.add("reset_password"),
  tooltip: () => "Send an email to reset your password",
  order: { priority: 2, indentation: 1 }
});

export const unlockAccountMenuItem = MenuRoute({
  icon: ["fas", "lock-open"],
  label: "Unlock account",
  route: securityRoute.add("unlock"),
  tooltip: () => "Send an email to unlock your account",
  order: { priority: 2, indentation: 1 }
});
