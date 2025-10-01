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
  template: `
    <baw-model-list [modelKey]="'projects'" [filterPlaceholder]="'Filter projects'">
      <!--
        This error message is quite generic because it can appear under multiple
        conditions:
          1. There are no projects in the system
          2. The user does not have permission to view any projects
          3. The user filtered the list to something that has no results
      -->
      <ng-template #noResultsTemplate>
        No projects found
      </ng-template>
    </baw-model-list>
  `,
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
