import { ChangeDetectionStrategy, Component } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import {
  adminAnalysisJobsMenuItem,
  adminAudioRecordingsMenuItem,
  adminCategory,
  adminDashboardMenuItem,
  adminJobStatusMenuItem,
  adminOrphanSitesMenuItem,
  adminScriptsMenuItem,
  adminTagGroupsMenuItem,
  adminTagsMenuItem,
  adminUserListMenuItem
} from "../admin.menus";

export const adminMenuItemActions = [
  adminUserListMenuItem,
  adminOrphanSitesMenuItem,
  adminScriptsMenuItem,
  adminTagsMenuItem,
  adminTagGroupsMenuItem,
  adminAudioRecordingsMenuItem,
  adminAnalysisJobsMenuItem,
  adminJobStatusMenuItem
];

@Page({
  category: adminCategory,
  menus: {
    actions: List<AnyMenuItem>(adminMenuItemActions),
    links: List()
  },
  self: adminDashboardMenuItem
})
@Component({
  selector: "app-dashboard",
  template: `
    <h1>Admin Dashboard</h1>
    <p>Welcome to the super-secret-site-settings!</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent extends PageComponent {}
