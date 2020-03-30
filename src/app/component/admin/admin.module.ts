import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { adminRoute } from "./admin.menus";
import { AdminAudioRecordingsListComponent } from "./audio-recordings/list/list.component";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { AdminScriptsNewComponent } from "./scripts-new/scripts-new.component";
import { AdminScriptsComponent } from "./scripts/scripts.component";
import { AdminUserListComponent } from "./user-list/user-list.component";

const components = [
  AdminAudioRecordingsListComponent,
  AdminDashboardComponent,
  AdminUserListComponent,
  AdminScriptsComponent,
  AdminScriptsNewComponent
];
const routes = adminRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components]
})
export class AdminModule {}
