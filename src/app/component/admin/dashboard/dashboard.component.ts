import { ChangeDetectionStrategy, Component } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
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

@Page({
  category: adminCategory,
  menus: {
    actions: List<AnyMenuItem>(adminMenuItemActions),
    links: List(),
  },
  self: adminDashboardMenuItem,
})
@Component({
  selector: "app-dashboard",
  template: `
    <h1>Admin Dashboard</h1>
    <p>Welcome to the super-secret-site-settings!</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent extends PageComponent {}
