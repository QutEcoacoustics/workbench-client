import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem,
} from "@components/projects/projects.menus";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { IProject, Project } from "@models/Project";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { Card } from "@shared/cards/cards.component";
import { List } from "immutable";

export const projectsMenuItemActions = [
  newProjectMenuItem,
  requestProjectMenuItem,
];

@Component({
  selector: "baw-projects-list",
  template: `
    <ng-container *ngIf="!error">
      <baw-debounce-input
        label="Filter"
        placeholder="Filter Projects"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <baw-loading *ngIf="loading"></baw-loading>

      <ng-container *ngIf="!loading">
        <!-- Projects Exist -->
        <ng-container *ngIf="cardList.size > 0; else empty">
          <baw-cards [cards]="cardList"></baw-cards>
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
  public cardList: List<Card> = List([]);

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
        const cards = projects.map((project) => project.getCard());
        this.cardList = List(cards);
      }
    );
  }
}

ListComponent.LinkComponentToPageInfo({
  category: projectsCategory,
  menus: { actions: List(projectsMenuItemActions) },
}).AndMenuRoute(projectsMenuItem);

export { ListComponent };
