import { dataRequestMenuItem } from '@components/data-request/data-request.menus';
import { homeCategory, homeMenuItem } from '@components/home/home.menus';
import {
  myAccountMenuItem,
  myAnnotationsMenuItem,
} from '@components/profile/profile.menus';
import { projectsMenuItem } from '@components/projects/projects.menus';
import { reportProblemMenuItem } from '@components/report-problem/report-problem.menus';
import {
  loginMenuItem,
  registerMenuItem,
} from '@components/security/security.menus';
import { sendAudioMenuItem } from '@components/send-audio/send-audio.menus';
import { statisticsMenuItem } from '@components/statistics/statistics.menus';
import { NavigableMenuItem } from '@interfaces/menusInterfaces';
import { List } from 'immutable';
import { audioAnalysisMenuItem, libraryMenuItem } from './externalMenus';

/**
 * Default secondary menu items
 */
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
    statisticsMenuItem,
  ]),
  defaultCategory: homeCategory,
};
