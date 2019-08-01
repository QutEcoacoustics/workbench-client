import {
  PageInfo,
  InternalRoute
} from 'src/app/interfaces/layout-menus.interfaces';
import { Routes } from '@angular/router';
import {
  ResetPasswordComponent,
  resetPasswordComponentInfo
} from './reset-password.component';
import { SecondaryMenuComponent } from 'src/app/component/shared/secondary-menu/secondary-menu.component';
import { ActionMenuComponent } from 'src/app/component/shared/action-menu/action-menu.component';

export const resetPasswordPageInfo: PageInfo = {
  component: resetPasswordComponentInfo,
  menus: {
    actions: null,
    links: null
  }
};

export const resetPasswordRoutes: Routes = [
  {
    path: resetPasswordComponentInfo.sub_route,
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
        component: ActionMenuComponent,
        data: resetPasswordPageInfo
      }
    ]
  }
];
