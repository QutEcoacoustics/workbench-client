import { Injectable, InjectionToken } from "@angular/core";
import { audioAnalysesMenuItem } from "@components/audio-analysis/audio-analysis.menus";
import { dataRequestMenuItem } from "@components/data-request/data-request.menus";
import { homeCategory, homeMenuItem } from "@components/home/home.menus";
import { libraryMenuItem } from "@components/library/library.menus";
import {
  myAccountMenuItem,
  myAnnotationsMenuItem,
} from "@components/profile/profile.menus";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { shallowRegionsMenuItem } from "@components/regions/regions.menus";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import {
  loginMenuItem,
  registerMenuItem,
} from "@components/security/security.menus";
import { sendAudioMenuItem } from "@components/send-audio/send-audio.menus";
import { statisticsMenuItem } from "@components/statistics/statistics.menus";
import { Category, NavigableMenuItem } from "@interfaces/menusInterfaces";
import { ConfigService } from "@services/config/config.service";
import { OrderedSet } from "immutable";

export interface IDefaultMenu {
  contextLinks: OrderedSet<NavigableMenuItem>;
  defaultCategory: Category;
}

/**
 * Injectable token for default secondary menu item links
 */
export const DEFAULT_MENU = new InjectionToken<IDefaultMenu>("DEFAULT_MENU");

@Injectable()
export class DefaultMenu {
  public static getMenu(config: ConfigService): IDefaultMenu {
    return {
      contextLinks: OrderedSet([
        homeMenuItem,
        // Change links depending on config settings
        config.settings.hideProjects
          ? shallowRegionsMenuItem
          : projectsMenuItem,
        loginMenuItem,
        registerMenuItem,
        myAccountMenuItem,
        myAnnotationsMenuItem,
        audioAnalysesMenuItem,
        libraryMenuItem,
        dataRequestMenuItem,
        sendAudioMenuItem,
        reportProblemMenuItem,
        statisticsMenuItem,
      ]),
      defaultCategory: homeCategory,
    };
  }
}
