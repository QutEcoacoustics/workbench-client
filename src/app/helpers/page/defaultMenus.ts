import { dataRequestMenuItem } from "@component/data-request/data-request.menus";
import { homeCategory, homeMenuItem } from "@component/home/home.menus";
import { myAccountMenuItem } from "@component/profile/profile.menus";
import { projectsMenuItem } from "@component/projects/projects.menus";
import { reportProblemMenuItem } from "@component/report-problem/report-problem.menus";
import {
  loginMenuItem,
  registerMenuItem,
} from "@component/security/security.menus";
import { sendAudioMenuItem } from "@component/send-audio/send-audio.menus";
import { statisticsMenuItem } from "@component/statistics/statistics.menus";
import { NavigableMenuItem } from "@interfaces/menusInterfaces";
import { List } from "immutable";
import {
  annotationsMenuItem,
  audioAnalysisMenuItem,
  libraryMenuItem,
} from "./externalMenus";

/**
 * Default secondary menu items
 */
export const DefaultMenu = {
  contextLinks: List<NavigableMenuItem>([
    homeMenuItem,
    loginMenuItem,
    registerMenuItem,
    myAccountMenuItem,
    annotationsMenuItem,
    projectsMenuItem,
    audioAnalysisMenuItem,
    libraryMenuItem,
    dataRequestMenuItem,
    sendAudioMenuItem,
    reportProblemMenuItem,
    statisticsMenuItem,
  ]),
  defaultCategory: homeCategory,
};
