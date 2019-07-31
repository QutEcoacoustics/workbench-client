import { LinkInterface } from 'src/app/interfaces/layout-menus.interfaces';
import { loginPageInfo } from 'src/app/component/authentication/pages/login/login.component.menu';
import { registerPageInfo } from 'src/app/component/authentication/pages/register/register.component.menu';
import { resetPasswordPageInfo } from 'src/app/component/authentication/pages/reset-password/reset-password.component.menu';

export const secondaryLinks: LinkInterface[] = [
  loginPageInfo as LinkInterface,
  registerPageInfo as LinkInterface,
  resetPasswordPageInfo as LinkInterface
];
