import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectsService } from "@baw-api/project/projects.service";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem,
} from "@components/projects/projects.menus";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Project } from "@models/Project";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";

export const projectsMenuItemActions = [
  newProjectMenuItem,
  requestProjectMenuItem,
  audioRecordingMenuItems.list.base,
  audioRecordingMenuItems.batch.base,
];

@Component({
  selector: "baw-projects-list",
  template: `
    @if (!error) {
      <baw-debounce-input
        label="Filter"
        placeholder="Filter Projects"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      @if (!loading) {
        <!-- Projects Exist -->
        @if (models.size > 0) {
          <baw-model-cards [models]="models"></baw-model-cards>
        } @else {
          <h4 class="text-center">Your list of projects is empty</h4>
        }
        <!-- Projects Don't Exist -->
      }

      @if (displayPagination) {
        <ngb-pagination
          aria-label="Pagination Buttons"
          class="mt-2 d-flex justify-content-end"
          [collectionSize]="collectionSize"
          [(page)]="page"
        ></ngb-pagination>
      }
    }
    <baw-error-handler [error]="error"></baw-error-handler>
  `,
  standalone: false
})
class ListComponent extends PaginationTemplate<Project> {
  public models: List<Project> = List([]);

  public constructor(
    router: Router,
    route: ActivatedRoute,
    config: NgbPaginationConfig,
    projectsService: ProjectsService
  ) {
    super(
      router,
      route,
      config,
      projectsService,
      "name",
      () => [],
      (projects) => {
        this.models = List(projects);
      }
    );
  }
}

ListComponent.linkToRoute({
  category: projectsCategory,
  pageRoute: projectsMenuItem,
  menus: { actions: List(projectsMenuItemActions) },
});

export { ListComponent };
