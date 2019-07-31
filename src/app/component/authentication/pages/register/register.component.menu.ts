import {
  PageInfo,
  InternalRoute
} from 'src/app/interfaces/layout-menus.interfaces';
import { Routes } from '@angular/router';
import { RegisterComponent, registerComponentInfo } from './register.component';
import { SecondaryMenuComponent } from 'src/app/component/shared/secondary-menu/secondary-menu.component';

export const registerPageInfo: PageInfo = {
  component: registerComponentInfo,
  menus: {
    actions: null,
    links: null
  }
};

export const registerRoutes: Routes = [
  {
    path: registerComponentInfo.sub_route,
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
