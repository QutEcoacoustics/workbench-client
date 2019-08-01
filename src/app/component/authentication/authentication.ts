import { Category } from 'src/app/interfaces/layout-menus.interfaces';
import { Route } from '@angular/router';

export const securityCategory: Category = {
  icon: ['fas', 'user'],
  label: 'Accounts',
  route: 'security' as Route
};
