import { Component } from "@angular/core";
import { ProjectsService } from "@baw-api/project/projects.service";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem,
} from "@components/projects/projects.menus";
import { List } from "immutable";
import { ModelListComponent } from "@shared/model-list/model-list.component";
import { MODEL_LIST_SERVICE } from "@shared/model-list/model-list.tokens";
import { PageComponent } from "@helpers/page/pageComponent";

export const projectsMenuItemActions = [
  newProjectMenuItem,
  requestProjectMenuItem,
  audioRecordingMenuItems.list.base,
  audioRecordingMenuItems.batch.base,
];

@Component({
  selector: "baw-projects-list",
  templateUrl: "./list.component.html",
  imports: [ModelListComponent],
  providers: [
    { provide: MODEL_LIST_SERVICE, useExisting: ProjectsService },
  ],
})
class ProjectListComponent extends PageComponent {}

ProjectListComponent.linkToRoute({
  category: projectsCategory,
  pageRoute: projectsMenuItem,
  menus: { actions: List(projectsMenuItemActions) },
});

export { ProjectListComponent };
