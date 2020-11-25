import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { List } from "immutable";
import {
  adminAnalysisJobsMenuItem,
  adminCategory,
  adminDashboardMenuItem,
  adminJobStatusMenuItem,
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

AdminDashboardComponent.linkComponentToPageInfo({
  category: adminCategory,
  menus: { actions: List<AnyMenuItem>(adminMenuItemActions) },
}).andMenuRoute(adminDashboardMenuItem);

export { AdminDashboardComponent };
