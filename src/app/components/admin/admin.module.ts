import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { adminRoute } from "./admin.menus";
import { AnalysisJobsModule } from "./analysis-jobs/analysis-jobs.module";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { OrphanSitesModule } from "./orphan/orphans.module";
import { SettingsModule } from "./settings/settings.module";
import { TagGroupsModule } from "./tag-group/tag-groups.module";
import { TagsModule } from "./tags/tags.module";
import { AdminThemeTemplateComponent } from "./theme-template/theme-template.component";
import { AdminUserListComponent } from "./users/user.component";
import { AllUploadsComponent } from "./all-uploads/all-uploads.component";
import { DateTimeExampleComponent } from "./datetime-example/datetime-example.component";

const modules = [
  AnalysisJobsModule,
  OrphanSitesModule,
  SettingsModule,
  TagGroupsModule,
  TagsModule,
];
const components = [
  AdminDashboardComponent,
  AdminUserListComponent,
  AdminThemeTemplateComponent,
  AllUploadsComponent,
  DateTimeExampleComponent,
];
const routes = adminRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes), ...modules],
  exports: [RouterModule, ...components, ...modules],
})
export class AdminModule {}
