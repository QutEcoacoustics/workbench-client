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
  adminUserListMenuItem,
} from "../admin.menus";
import { adminAudioRecordingsMenuItem } from "../audio-recordings/audio-recordings.menus";
import { adminOrphansMenuItem } from "../orphan/orphans.menus";
import { adminScriptsMenuItem } from "../scripts/scripts.menus";
import { adminTagGroupsMenuItem } from "../tag-group/tag-group.menus";
import { adminTagsMenuItem } from "../tags/tags.menus";

export const adminMenuItemActions = [
  adminUserListMenuItem,
  adminOrphansMenuItem,
  adminScriptsMenuItem,
  adminTagsMenuItem,
  adminTagGroupsMenuItem,
  adminAudioRecordingsMenuItem,
  adminAnalysisJobsMenuItem,
  adminJobStatusMenuItem,
  adminCmsMenuItem,
  adminThemeMenuItem,
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

AdminDashboardComponent.linkToRouterWith(
  { category: adminCategory, menus: { actions: List(adminMenuItemActions) } },
  adminDashboardMenuItem
);

export { AdminDashboardComponent };
