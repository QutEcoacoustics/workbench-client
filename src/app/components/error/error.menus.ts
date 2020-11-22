import { MenuRoute } from '@interfaces/menusInterfaces';
import { StrongRoute } from '@interfaces/strongRoute';

export const pageNotFoundRoute = StrongRoute.Base.add('**');
export const pageNotFoundMenuItem = MenuRoute({
  icon: ['fas', 'exclamation-triangle'],
  label: 'Page Not Found',
  route: pageNotFoundRoute,
  disabled: true,
  tooltip: () => 'The requested page was not found',
});
