import {
  ActionListTitle,
  ActionListTitleInterface
} from 'src/app/services/layout-menus/layout-menus.interface';

export class AuthenticationCollection implements ActionListTitle {
  getActionListTitle(): ActionListTitleInterface {
    return Object.freeze({
      icon: ['fas', 'user'],
      label: 'Accounts'
    });
  }
}
