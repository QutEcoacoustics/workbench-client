import { Category, MenuRoute } from '@interfaces/menusInterfaces';
import { StrongRoute } from '@interfaces/strongRoute';
import { homeCategory } from '../home/home.menus';

export const statisticsRoute = StrongRoute.Base.add('website_statistics');

export const statisticsCategory: Category = homeCategory;

export const statisticsMenuItem = MenuRoute({
  icon: ['fas', 'chart-line'],
  label: 'Statistics',
  route: statisticsRoute,
  tooltip: () => 'Annotation and audio recording statistics',
  order: 10,
});
