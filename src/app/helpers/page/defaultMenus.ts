import { List } from "immutable";
import { dataRequestMenuItem } from "src/app/component/data-request/data-request.menus";
import { homeCategory, homeMenuItem } from "src/app/component/home/home.menus";
import {
  myAccountMenuItem,
  myAnnotationsMenuItem
} from "src/app/component/profile/profile.menus";
import { projectsMenuItem } from "src/app/component/projects/projects.menus";
import { reportProblemMenuItem } from "src/app/component/report-problem/report-problem.menus";
import {
  loginMenuItem,
  registerMenuItem
} from "src/app/component/security/security.menus";
import { sendAudioMenuItem } from "src/app/component/send-audio/send-audio.menus";
import { statisticsMenuItem } from "src/app/component/statistics/statistics.menus";
import {
  MenuLink,
  NavigableMenuItem
} from "src/app/interfaces/menusInterfaces";
import { audioAnalysisMenuItem, libraryMenuItem } from "./externalMenus";

export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    homeMenuItem,
    loginMenuItem,
    registerMenuItem,
    myAccountMenuItem,
    myAnnotationsMenuItem,
    projectsMenuItem,
    audioAnalysisMenuItem,
    libraryMenuItem,
    dataRequestMenuItem,
    sendAudioMenuItem,
    reportProblemMenuItem,
    statisticsMenuItem
  ]),
  defaultCategory: homeCategory
};
