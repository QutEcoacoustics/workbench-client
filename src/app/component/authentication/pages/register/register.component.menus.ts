import { LayoutMenusInterface } from 'src/app/services/layout-menus/layout-menus.interface';
import { AuthenticationCollection } from '../../authentication.menu';

export const menus: LayoutMenusInterface = {
  action: {
    list_title: AuthenticationCollection.prototype.getActionListTitle(),
    links: []
  }
};
