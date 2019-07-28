import {
  ActionListTitle,
  ActionListTitleInterface
} from 'src/app/services/layout-menus/layout-menus.interface';

export class ProfileCollection implements ActionListTitle {
  getActionListTitle(): ActionListTitleInterface {
    return Object.freeze({
      icon: ['fas', 'user'],
      label: 'My Profile'
    });
  }
}
