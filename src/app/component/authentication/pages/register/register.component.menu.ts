import {
  PageInfo,
  InternalRoute
} from 'src/app/interfaces/layout-menus.interfaces';
import { Category } from '../../authentication';
import { Routes } from '@angular/router';
import { RegisterComponent } from './register.component';
import { SecondaryMenuComponent } from 'src/app/component/shared/secondary-menu/secondary-menu.component';

export const registerPageInfo: PageInfo = {
  icon: ['fas', 'user-plus'],
  label: 'Register',
  category: Category,
  tooltip: () => 'Create an account',
  actions: null,
  links: null,
  uri: 'register' as InternalRoute
};

export const registerRoutes: Routes = [
  {
    path: registerPageInfo.uri,
    children: [
      {
        path: '',
        component: RegisterComponent,
        data: registerPageInfo
      },
      {
        path: '',
        outlet: 'secondary',
        component: SecondaryMenuComponent,
        data: registerPageInfo
      }
    ]
  }
];
