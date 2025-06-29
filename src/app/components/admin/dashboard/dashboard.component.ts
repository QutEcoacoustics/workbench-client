import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { List } from "immutable";
import { scriptsMenuItem } from "@components/scripts/scripts.menus";
import {
  adminAnalysisJobsMenuItem,
  adminCategory,
  adminCmsMenuItem,
  adminDashboardMenuItem,
  adminJobStatusMenuItem,
  adminThemeMenuItem,
  adminUploadsMenuItem,
  adminUserListMenuItem,
  adminDateTimeTemplateMenuItem,
} from "../admin.menus";
import { adminOrphansMenuItem } from "../orphan/orphans.menus";
import { adminSettingsMenuItem } from "../settings/settings.menus";
import { adminTagGroupsMenuItem } from "../tag-group/tag-group.menus";
import { adminTagsMenuItem } from "../tags/tags.menus";
import { SiteSettingsComponent } from "./components/site-settings/site-settings.component";

export const adminMenuItemActions = [
  adminAnalysisJobsMenuItem,
  adminCmsMenuItem,
  adminJobStatusMenuItem,
  adminOrphansMenuItem,
  adminSettingsMenuItem,
  adminTagGroupsMenuItem,
  adminTagsMenuItem,
  adminThemeMenuItem,
  adminUserListMenuItem,
  adminUploadsMenuItem,
  adminDateTimeTemplateMenuItem,

  // even though listing scripts is not restricted to admins, I have included it
  // in the admin dashboard because it is not linked to from any other page and
  // and it's likely that the only people who would want to list all of the
  // scripts would be admins
  scriptsMenuItem,
];

@Component({
  selector: "baw-dashboard",
  templateUrl: "./dashboard.component.html",
  imports: [SiteSettingsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AdminDashboardComponent extends PageComponent {}

AdminDashboardComponent.linkToRoute({
  category: adminCategory,
  pageRoute: adminDashboardMenuItem,
  menus: { actions: List(adminMenuItemActions) },
});

export { AdminDashboardComponent };
