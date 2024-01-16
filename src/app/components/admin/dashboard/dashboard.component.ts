import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { List } from "immutable";
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
import { adminScriptsMenuItem } from "../scripts/scripts.menus";
import { adminSettingsMenuItem } from "../settings/settings.menus";
import { adminTagGroupsMenuItem } from "../tag-group/tag-group.menus";
import { adminTagsMenuItem } from "../tags/tags.menus";

export const adminMenuItemActions = [
  adminAnalysisJobsMenuItem,
  adminCmsMenuItem,
  adminJobStatusMenuItem,
  adminOrphansMenuItem,
  adminScriptsMenuItem,
  adminSettingsMenuItem,
  adminTagGroupsMenuItem,
  adminTagsMenuItem,
  adminThemeMenuItem,
  adminUserListMenuItem,
  adminUploadsMenuItem,
  adminDateTimeTemplateMenuItem,
];

@Component({
  selector: "baw-dashboard",
  template: `
    <h1>Admin Dashboard</h1>
    <p>Welcome to the super-secret-site-settings!</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class AdminDashboardComponent extends PageComponent {}

AdminDashboardComponent.linkToRoute({
  category: adminCategory,
  pageRoute: adminDashboardMenuItem,
  menus: { actions: List(adminMenuItemActions) },
});

export { AdminDashboardComponent };
