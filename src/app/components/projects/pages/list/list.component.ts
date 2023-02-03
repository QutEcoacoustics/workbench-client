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
    <ng-container *ngIf="!error">
      <ng-container *ngIf="!loading && models.size > 0;">
        <div id="site-map" style="width: 100%; height: 24em;">
          <baw-site-map [projects]="models.toArray()"></baw-site-map>
        </div>
      </ng-container>

      <baw-debounce-input
        label="Filter"
        placeholder="Filter Projects"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <ng-container *ngIf="!loading">
        <!-- Projects Exist -->
        <ng-container *ngIf="models.size > 0; else empty">
          <baw-model-cards [models]="models"></baw-model-cards>
        </ng-container>

        <!-- Projects Don't Exist -->
        <ng-template #empty>
          <h4 class="text-center">Your list of projects is empty</h4>
        </ng-template>
      </ng-container>

      <ngb-pagination
        *ngIf="displayPagination"
        aria-label="Pagination Buttons"
        class="mt-2 d-flex justify-content-end"
        [collectionSize]="collectionSize"
        [(page)]="page"
      ></ngb-pagination>
    </ng-container>
    <baw-error-handler [error]="error"></baw-error-handler>
  `,
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
