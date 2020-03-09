import { ChangeDetectionStrategy, Component } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/helpers/page/pageDecorator";
import {
  adminCategory,
  adminDashboardMenuItem,
  adminUserListMenuItem,
  adminOrphanSitesMenuItem,
  adminScriptsMenuItem,
  adminTagGroupsMenuItem,
  adminTagsMenuItem,
  adminAudioRecordingsMenuItem,
  adminAnalysisJobsMenuItem,
  adminJobStatusMenuItem
} from "../admin.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";

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
