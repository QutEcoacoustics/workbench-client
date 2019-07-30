import { AuthenticationCollection } from '../../authentication';
import {
  LayoutMenusInterface,
  Href
} from 'src/app/services/layout-menus/layout-menus.interface';

export const menus: LayoutMenusInterface = {
  action: {
    list_title: AuthenticationCollection.prototype.getActionListTitle(),
    links: [
      {
        uri: new Href('https://www.ecosounds.org/my_account/password/new'),
        icon: ['fas', 'key'],
        label: 'Reset password',
        tooltip: 'Send an email to reset your password',
        predicate: loggedin => !loggedin
      },
      {
        uri: new Href('https://www.ecosounds.org/my_account/confirmation/new'),
        icon: ['fas', 'envelope'],
        label: 'Confirm account',
        tooltip: 'Resend the email to confirm your account',
        predicate: loggedin => !loggedin
      },
      {
        uri: new Href('https://www.ecosounds.org/my_account/unlock/new'),
        icon: ['fas', 'lock-open'],
        label: 'Unlock account',
        tooltip: 'Send an email to unlock your account',
        predicate: loggedin => !loggedin
      }
    ]
  }
};
