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
    {
      kind: "MenuLink",
      icon: registerMenuItem.icon,
      label: registerMenuItem.label,
      tooltip: registerMenuItem.tooltip,
      order: registerMenuItem.order,
      uri: "REPLACE_ME"
    },
    projectsMenuItem,
    {
      kind: "MenuLink",
      icon: ["fas", "server"],
      label: "Audio Analysis",
      tooltip: () => "Audio Analysis",
      order: { priority: 5, indentation: 0 },
      uri: "REPLACE_ME"
    },
    {
      kind: "MenuLink",
      icon: ["fas", "book"],
      label: "Library",
      tooltip: () => "Library",
      order: { priority: 6, indentation: 0 },
      uri: "REPLACE_ME"
    },
    {
      kind: "MenuLink",
      icon: dataRequestMenuItem.icon,
      label: dataRequestMenuItem.label,
      tooltip: dataRequestMenuItem.tooltip,
      order: dataRequestMenuItem.order,
      uri: "REPLACE_ME"
    },
    {
      kind: "MenuLink",
      icon: ["fas", "envelope"],
      label: "Send Audio",
      tooltip: () => "Send Audio",
      order: { priority: 8, indentation: 0 },
      uri: "REPLACE_ME"
    },
    {
      kind: "MenuLink",
      icon: reportProblemMenuItem.icon,
      label: reportProblemMenuItem.label,
      tooltip: reportProblemMenuItem.tooltip,
      order: reportProblemMenuItem.order,
      uri: "REPLACE_ME"
    },
    {
      kind: "MenuLink",
      icon: statisticsMenuItem.icon,
      label: statisticsMenuItem.label,
      tooltip: statisticsMenuItem.tooltip,
      order: statisticsMenuItem.order,
      uri: "REPLACE_ME"
    }
  ]),
  defaultCategory: homeCategory
};
