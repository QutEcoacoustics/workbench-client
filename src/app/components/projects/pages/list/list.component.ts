import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem,
} from "@components/projects/projects.menus";
import { PaginationTemplate } from "@helpers/scrollTemplate/paginationTemplate";
import { IProject, Project } from "@models/Project";
import { Card } from "@shared/cards/cards.component";
import { List } from "immutable";

export const projectsMenuItemActions = [
  newProjectMenuItem,
  requestProjectMenuItem,
];

@Component({
  selector: "app-projects-list",
  template: `
    <ng-container *ngIf="!error">
      <baw-debounce-input
        label="Filter"
        placeholder="Filter Projects"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

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

      <baw-loading [display]="loading"></baw-loading>

      <ngb-pagination
        *ngIf="collectionSize > 0"
        aria-label="Default pagination"
        class="mt-2 d-flex justify-content-end"
        [maxSize]="3"
        [rotate]="true"
        [pageSize]="pageSize"
        [collectionSize]="collectionSize"
        [(page)]="page"
      ></ngb-pagination>
    </ng-container>
    <baw-error-handler *ngIf="error" [error]="error"></baw-error-handler>
  `,
})
class ListComponent extends PaginationTemplate<IProject, Project> {
  public cardList: List<Card> = List([]);

  constructor(
    router: Router,
    route: ActivatedRoute,
    projectsService: ProjectsService
  ) {
    super(
      router,
      route,
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
