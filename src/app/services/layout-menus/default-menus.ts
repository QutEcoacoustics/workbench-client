import { LinkInterface } from 'src/app/interfaces/layout-menus.interfaces';
import { loginComponentInfo } from 'src/app/component/authentication/pages/login/login.component';
import { registerComponentInfo } from 'src/app/component/authentication/pages/register/register.component';

export const secondaryLinks: LinkInterface[] = [
  loginComponentInfo,
  registerComponentInfo
];
