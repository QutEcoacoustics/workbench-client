import { LinkInterface } from 'src/app/interfaces/layout-menus.interfaces';
import { loginComponentInfo } from 'src/app/component/authentication/pages/login/login.component';
import { registerComponentInfo } from 'src/app/component/authentication/pages/register/register.component';
import { List } from 'immutable';

export const secondaryLinks: List<LinkInterface> = List([
  loginComponentInfo,
  registerComponentInfo
]);
