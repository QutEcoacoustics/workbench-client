import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "src/app/helpers/page/pageRouting";
import { SharedModule } from "../shared/shared.module";
import { adminRoute } from "./admin.menus";
import { AdminAudioRecordingComponent } from "./audio-recordings/details/details.component";
import { AdminAudioRecordingsComponent } from "./audio-recordings/list/list.component";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { AdminScriptsComponent } from "./scripts/list/list.component";
import { AdminScriptsNewComponent } from "./scripts/new/new.component";
import { AdminTagGroupsDeleteComponent } from "./tag-group/delete/delete.component";
import { AdminTagGroupsEditComponent } from "./tag-group/edit/edit.component";
import { AdminTagGroupsComponent } from "./tag-group/list/list.component";
import { AdminTagGroupsNewComponent } from "./tag-group/new/new.component";
import { AdminTagsDeleteComponent } from "./tags/delete/delete.component";
import { AdminTagsEditComponent } from "./tags/edit/edit.component";
import { AdminTagsComponent } from "./tags/list/list.component";
import { AdminTagsNewComponent } from "./tags/new/new.component";
import { AdminUserListComponent } from "./users/list/list.component";

const components = [
  AdminAudioRecordingsComponent,
  AdminAudioRecordingComponent,
  AdminDashboardComponent,
  AdminScriptsComponent,
  AdminScriptsNewComponent,
  AdminTagGroupsComponent,
  AdminTagGroupsDeleteComponent,
  AdminTagGroupsEditComponent,
  AdminTagGroupsNewComponent,
  AdminTagsComponent,
  AdminTagsDeleteComponent,
  AdminTagsEditComponent,
  AdminTagsNewComponent,
  AdminUserListComponent
];
const routes = adminRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components]
})
export class AdminModule {}
