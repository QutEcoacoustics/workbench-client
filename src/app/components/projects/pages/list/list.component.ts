import { Component } from "@angular/core";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem,
} from "@components/projects/projects.menus";
import { ScrollTemplate } from "@helpers/scrollTemplate/scrollTemplate";
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
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <!-- Display project cards -->
      <div
        class="search-results"
        infiniteScroll
        [infiniteScrollDisabled]="disableScroll"
        (scrolled)="onScroll()"
      >
        <!-- Projects Exist -->
        <ng-container *ngIf="cardList.size > 0">
          <baw-cards [cards]="cardList"></baw-cards>
        </ng-container>

        <!-- Projects Don't Exist -->
        <ng-container *ngIf="cardList.size === 0 && !loading">
          <h4 class="text-center">Your list of projects is empty</h4>
        </ng-container>
      </div>

      <!-- Loading Projects -->
      <baw-loading [display]="loading"></baw-loading>
    </ng-container>
    <baw-error-handler *ngIf="error" [error]="error"></baw-error-handler>
  `,
})
class ListComponent extends ScrollTemplate<IProject, Project> {
  public cardList: List<Card> = List([]);

  constructor(projectsService: ProjectsService) {
    super(
      projectsService,
      "name",
      () => [],
      (projects, hasResetPage) => {
        const cards = projects.map((project) => project.getCard());
        this.cardList = hasResetPage
          ? List(cards)
          : this.cardList.push(...cards);
      }
    );
  }
}

ListComponent.LinkComponentToPageInfo({
  category: projectsCategory,
  menus: { actions: List(projectsMenuItemActions) },
}).AndMenuRoute(projectsMenuItem);

export { ListComponent };
