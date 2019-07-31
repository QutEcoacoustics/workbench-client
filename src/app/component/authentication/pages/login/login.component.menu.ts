import {
  PageInfo,
  InternalRoute
} from 'src/app/interfaces/layout-menus.interfaces';
import { Category } from '../../authentication';
import { SecondaryMenuComponent } from 'src/app/component/shared/secondary-menu/secondary-menu.component';
import { Routes } from '@angular/router';
import { LoginComponent } from './login.component';

export const loginPageInfo: PageInfo = {
  icon: ['fas', 'sign-in-alt'],
  label: 'Log in',
  category: Category,
  tooltip: () => 'Log into the website',
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
  links: null,
  uri: 'login' as InternalRoute,
  predicate: loggedin => !loggedin
};

export const loginRoutes: Routes = [
  {
    path: loginPageInfo.uri,
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
