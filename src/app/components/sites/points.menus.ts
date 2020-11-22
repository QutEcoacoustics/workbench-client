import { regionMenuItem } from '@components/regions/regions.menus';
import { Category, MenuLink, MenuRoute } from '@interfaces/menusInterfaces';
import {
  deleteSiteMenuItem,
  editSiteMenuItem,
  newSiteMenuItem,
  siteAnnotationsMenuItem,
  siteHarvestMenuItem,
  siteMenuItem,
  sitesCategory,
} from './sites.menus';

export const pointsRoute = regionMenuItem.route.addFeatureModule('points');

export const pointsCategory: Category = {
  ...sitesCategory,
  label: 'Points',
  route: pointsRoute.add(':siteId'),
};

export const pointMenuItem = MenuRoute({
  ...siteMenuItem,
  label: 'Point',
  parent: regionMenuItem,
  route: pointsCategory.route,
  tooltip: () => 'The current point',
});

export const newPointMenuItem = MenuRoute({
  ...newSiteMenuItem,
  label: 'New point',
  parent: regionMenuItem,
  route: pointsRoute.add('new'),
  tooltip: () => 'Create a new point',
});

export const pointAnnotationsMenuItem = MenuLink({
  ...siteAnnotationsMenuItem,
  tooltip: () => 'Download annotations for this point',
  uri: () => 'REPLACE_ME',
});

export const editPointMenuItem = MenuRoute({
  ...editSiteMenuItem,
  label: 'Edit this point',
  parent: pointMenuItem,
  route: pointMenuItem.route.add('edit'),
  tooltip: () => 'Change the details for this point',
});

export const pointHarvestMenuItem = MenuRoute({
  ...siteHarvestMenuItem,
  parent: pointMenuItem,
  route: pointMenuItem.route.add('harvest'),
  tooltip: () => 'Upload new audio to this point',
});

export const deletePointMenuItem = MenuRoute({
  ...deleteSiteMenuItem,
  label: 'Delete point',
  parent: pointMenuItem,
  route: pointMenuItem.route.add('delete'),
  tooltip: () => 'Delete this point',
});
