import {
  PageInfo,
  InternalRoute
} from 'src/app/interfaces/layout-menus.interfaces';
import { Routes } from '@angular/router';
import {
  ResetPasswordComponent,
  resetComponentInfo
} from './reset-password.component';
import { SecondaryMenuComponent } from 'src/app/component/shared/secondary-menu/secondary-menu.component';

export const resetPasswordPageInfo: PageInfo = {
  component: resetComponentInfo,
  menus: {
    actions: null,
    links: null
  }
};

export const resetRoutes: Routes = [
  {
    path: resetComponentInfo.sub_route,
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
