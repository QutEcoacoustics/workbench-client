import { Category, MenuRoute } from '@interfaces/menusInterfaces';
import {
  defaultEditIcon,
  defaultNewIcon,
  isAdminPredicate,
} from 'src/app/app.menus';
import { adminDashboardMenuItem, adminRoute } from '../admin.menus';

export const adminScriptsRoute = adminRoute.addFeatureModule('scripts');

export const adminScriptsCategory: Category = {
  icon: ['fas', 'scroll'],
  label: 'Scripts',
  route: adminScriptsRoute,
};

export const adminScriptsMenuItem = MenuRoute({
  icon: ['fas', 'scroll'],
  label: 'Scripts',
  route: adminScriptsCategory.route,
  tooltip: () => 'Manage custom scripts',
  parent: adminDashboardMenuItem,
  predicate: isAdminPredicate,
});

export const adminNewScriptsMenuItem = MenuRoute({
  icon: defaultNewIcon,
  label: 'New Script',
  route: adminScriptsMenuItem.route.add('new'),
  tooltip: () => 'Create a new script',
  parent: adminScriptsMenuItem,
  predicate: isAdminPredicate,
});

const adminScriptRoute = adminScriptsRoute.add(':scriptId');

export const adminScriptMenuItem = MenuRoute({
  icon: ['fas', 'scroll'],
  label: 'Script',
  route: adminScriptRoute,
  tooltip: () => 'Manage script',
  parent: adminScriptsMenuItem,
  predicate: isAdminPredicate,
});

export const adminEditScriptMenuItem = MenuRoute({
  icon: defaultEditIcon,
  label: 'New Version',
  route: adminScriptRoute.add('edit'),
  tooltip: () => 'Create new version of this script',
  parent: adminScriptMenuItem,
  predicate: isAdminPredicate,
});
