import { homeCategory } from '@components/home/home.menus';
import { Category, MenuRoute } from '@interfaces/menusInterfaces';
import { StrongRoute } from '@interfaces/strongRoute';

export const reportProblemsRoute = StrongRoute.Base.add('report_problem');

export const reportProblemsCategory: Category = homeCategory;

export const reportProblemMenuItem = MenuRoute({
  icon: ['fas', 'bug'],
  label: 'Report Problem',
  route: reportProblemsRoute,
  tooltip: () => 'Report a problem with the website',
  order: 9,
});
