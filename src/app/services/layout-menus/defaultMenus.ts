import { List } from "immutable";
import { dataRequestMenuItem } from "src/app/component/data-request/data-request.menus";
import { homeCategory, homeMenuItem } from "src/app/component/home/home.menus";
import { projectsMenuItem } from "src/app/component/projects/projects.menus";
import { reportProblemMenuItem } from "src/app/component/report-problem/report-problem.menus";
import {
  loginMenuItem,
  registerMenuItem
} from "src/app/component/security/security.menus";
import { statisticsMenuItem } from "src/app/component/statistics/statistics.menus";
import { NavigableMenuItem } from "src/app/interfaces/menusInterfaces";

export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    homeMenuItem,
    loginMenuItem,
    registerMenuItem,
    projectsMenuItem,
    dataRequestMenuItem,
    reportProblemMenuItem,
    statisticsMenuItem
  ]),
  defaultCategory: homeCategory
};
