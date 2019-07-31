import { PageInfo } from 'src/app/interfaces/layout-menus.interfaces';
import { SecondaryMenuComponent } from 'src/app/component/shared/secondary-menu/secondary-menu.component';
import { Routes } from '@angular/router';
import { LoginComponent, loginComponentInfo } from './login.component';

export const loginPageInfo: PageInfo = {
  component: loginComponentInfo,
  menus: {
    actions: [
      {
        icon: ['fas', 'key'],
        label: 'Reset password',
        tooltip: () => 'Send an email to reset your password',
        action: () => console.log('Reset password'),
        predicate: loggedin => !loggedin
      },
      {
        icon: ['fas', 'envelope'],
        label: 'Confirm account',
        tooltip: () => 'Resend the email to confirm your account',
        action: () => console.log('Confirm account'),
        predicate: loggedin => !loggedin
      },
      {
        icon: ['fas', 'lock-open'],
        label: 'Unlock account',
        tooltip: () => 'Send an email to unlock your account',
        action: () => console.log('Unlock account'),
        predicate: loggedin => !loggedin
      }
    ],
    links: null
  }
};

export const loginRoutes: Routes = [
  {
    path: loginComponentInfo.uri,
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
      }
    ]
  }
];
