import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { adminRoute } from "./admin.menus";
import { AnalysisJobsModule } from "./analysis-jobs/analysis-jobs.module";
import { AudioRecordingsModule } from "./audio-recordings/audio-recordings.module";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { OrphanSitesModule } from "./orphan/orphans.module";
import { ScriptsModule } from "./scripts/scripts.module";
import { TagGroupsModule } from "./tag-group/tag-groups.module";
import { TagsModule } from "./tags/tags.module";
import { AdminThemeTemplateComponent } from "./theme-template/theme-template.component";
import { AdminUserListComponent } from "./users/user.component";

const modules = [
  AnalysisJobsModule,
  AudioRecordingsModule,
  OrphanSitesModule,
  ScriptsModule,
  TagGroupsModule,
  TagsModule,
];
const components = [
  AdminDashboardComponent,
  AdminUserListComponent,
  AdminThemeTemplateComponent,
];
const routes = adminRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes), ...modules],
  exports: [RouterModule, ...components, ...modules],
})
export class AdminModule {}
