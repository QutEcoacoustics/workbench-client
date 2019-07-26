import { Menus } from 'src/app/services/layout-menus/menus';
import { ActionMenuIcon, ActionMenuTitle } from '../../authentication.menu';

export const AuthenticationRegisterIcon: [string, string] = [
  'fas',
  'user-plus'
];
export const menus: Menus = {
  action: {
    title: {
      icon: ActionMenuIcon,
      label: ActionMenuTitle
    },
    links: []
  }
};
