import { Menus } from 'src/app/services/layout-menus/menus';
import { ActionMenuIcon, ActionMenuTitle } from '../../authentication.menu';

export const AuthenticationLoginIcon: [string, string] = ['fas', 'sign-in-alt'];
export const menus: Menus = {
  action: {
    title: {
      icon: ActionMenuIcon,
      label: ActionMenuTitle
    },
    links: [
      {
        route: 'https://www.ecosounds.org/my_account/password/new',
        icon: ['fas', 'key'],
        label: 'Reset password',
        tooltip: 'Send an email to reset your password',
        predicate: loggedin => !loggedin
      },
      {
        route: 'https://www.ecosounds.org/my_account/confirmation/new',
        icon: ['fas', 'envelope'],
        label: 'Confirm account',
        tooltip: 'Resend the email to confirm your account',
        predicate: loggedin => !loggedin
      },
      {
        route: 'https://www.ecosounds.org/my_account/unlock/new',
        icon: ['fas', 'lock-open'],
        label: 'Unlock account',
        tooltip: 'Send an email to unlock your account',
        predicate: loggedin => !loggedin
      }
    ]
  }
};
