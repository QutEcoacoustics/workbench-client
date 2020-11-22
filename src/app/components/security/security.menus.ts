import { Category, MenuRoute } from '@interfaces/menusInterfaces';
import { StrongRoute } from '@interfaces/strongRoute';
import { defaultUserIcon, isGuestPredicate } from 'src/app/app.menus';

export const securityRoute = StrongRoute.Base.add('security');

export const securityCategory: Category = {
  icon: defaultUserIcon,
  label: 'Accounts',
  route: securityRoute,
};

export const loginMenuItem = MenuRoute({
  icon: ['fas', 'sign-in-alt'],
  label: 'Log in',
  tooltip: () => 'Log into the website',
  route: securityRoute.add('login'),
  predicate: isGuestPredicate,
  order: 2,
});

export const registerMenuItem = MenuRoute({
  icon: ['fas', 'user-plus'],
  label: 'Register',
  route: securityRoute.add('register'),
  tooltip: () => 'Create an account',
  predicate: isGuestPredicate,
  order: 3,
});

export const confirmAccountMenuItem = MenuRoute({
  icon: ['fas', 'envelope'],
  label: 'Confirm account',
  route: securityRoute.add('confirmation'),
  tooltip: () => 'Resend the email to confirm your account',
  parent: loginMenuItem,
});

export const resetPasswordMenuItem = MenuRoute({
  icon: ['fas', 'key'],
  label: 'Reset password',
  route: securityRoute.add('reset_password'),
  tooltip: () => 'Send an email to reset your password',
  parent: loginMenuItem,
});

export const unlockAccountMenuItem = MenuRoute({
  icon: ['fas', 'lock-open'],
  label: 'Unlock account',
  route: securityRoute.add('unlock_account'),
  tooltip: () => 'Send an email to unlock your account',
  parent: loginMenuItem,
});
