import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { adminRoute } from "./admin.menus";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { AdminThemeTemplateComponent } from "./theme-template/theme-template.component";
import { AdminUserListComponent } from "./users/user.component";
import { AllUploadsComponent } from "./all-uploads/all-uploads.component";
import { DateTimeExampleComponent } from "./datetime-example/datetime-example.component";

const pages = [
  AdminDashboardComponent,
  AdminUserListComponent,
  AdminThemeTemplateComponent,
  AllUploadsComponent,
  DateTimeExampleComponent,
];
const routes = adminRoute.compileRoutes(getRouteConfigForPage);

@NgModule({
  imports: [RouterModule.forChild(routes), ...pages],
  exports: [RouterModule, ...pages],
})
export class AdminModule {}
