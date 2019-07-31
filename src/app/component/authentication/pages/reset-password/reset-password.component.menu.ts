import {
  PageInfo,
  InternalRoute
} from 'src/app/interfaces/layout-menus.interfaces';
import { Category } from '../../authentication';
import { Routes } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { SecondaryMenuComponent } from 'src/app/component/shared/secondary-menu/secondary-menu.component';

export const resetPasswordPageInfo: PageInfo = {
  icon: ['fas', 'unlock'],
  label: 'Reset password',
  category: Category,
  tooltip: () => 'Send an email to reset your password',
  actions: null,
  links: null,
  uri: 'reset_password' as InternalRoute
};

export const resetRoutes: Routes = [
  {
    path: resetPasswordPageInfo.uri,
    children: [
      {
        path: '',
        component: ResetPasswordComponent,
        data: resetPasswordPageInfo
      },
      {
        path: '',
        outlet: 'secondary',
        component: SecondaryMenuComponent,
        data: resetPasswordPageInfo
      },
      {
        path: '',
        outlet: 'action',
        component: SecondaryMenuComponent,
        data: resetPasswordPageInfo
      }
    ]
  }
];
