import { PageInfo } from 'src/app/interfaces/layout-menus.interfaces';
import { SecondaryMenuComponent } from 'src/app/component/shared/secondary-menu/secondary-menu.component';
import { Routes } from '@angular/router';
import { LoginComponent, loginComponentInfo } from './login.component';
import { List } from 'immutable';
import { resetPasswordComponentInfo } from '../reset-password/reset-password.component';
import { ActionMenuComponent } from 'src/app/component/shared/action-menu/action-menu.component';
import { securityCategory } from '../../authentication';

export const loginPageInfo: PageInfo = {
  component: loginComponentInfo,
  menus: {
    actions: {
      list_title: securityCategory,
      links: List([
        {
          ...resetPasswordComponentInfo,
          action: resetPasswordComponentInfo.uri
        },
        {
          icon: ['fas', 'envelope'],
          label: 'Confirm account',
          tooltip: () => 'Resend the email to confirm your account',
          action: () => console.log('Confirm account')
        },
        {
          icon: ['fas', 'lock-open'],
          label: 'Unlock account',
          tooltip: () => 'Send an email to unlock your account',
          action: () => console.log('Unlock account')
        }
      ])
    },
    links: null
  }
};

export const loginRoutes: Routes = [
  {
    path: loginComponentInfo.sub_route,
    children: [
      {
        path: '',
        component: LoginComponent,
        data: loginPageInfo
      },
      {
        path: '',
        outlet: 'secondary',
        component: SecondaryMenuComponent,
        data: loginPageInfo
      },
      {
        path: '',
        outlet: 'action',
        component: ActionMenuComponent,
        data: loginPageInfo
      }
    ]
  }
];
