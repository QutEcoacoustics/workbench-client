import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { map, takeUntil } from "rxjs/operators";
import { Card } from "src/app/component/shared/cards/cards.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem
} from "../../projects.menus";

export const projectsMenuItemActions = [
  newProjectMenuItem,
  requestProjectMenuItem
];

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>(projectsMenuItemActions),
    links: List()
  },
  self: projectsMenuItem
})
@Component({
  selector: "app-projects-list",
  template: `
    <!-- Display project cards -->
    <ng-container *ngIf="cardList">
      <ng-container *ngIf="cardList.size > 0; else noProjects">
        <app-cards [cards]="cardList"></app-cards>
      </ng-container>
      <ng-template #noProjects>
        <h4 class="text-center">Your list of projects is empty</h4>
      </ng-template>
    </ng-container>

    <app-loading [isLoading]="loading"></app-loading>
    <app-error-handler [error]="error"></app-error-handler>
  `
})
export class ListComponent extends PageComponent implements OnInit {
  cardList: List<Card>;
  loading: boolean;
  error: ApiErrorDetails;

  constructor(private api: ProjectsService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.api
      .list()
      .pipe(
        map((data: Project[]) => {
          return List(data.map(project => project.getCard()));
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (projects: List<Card>) => {
          this.cardList = projects;
          this.loading = false;
        },
        (err: ApiErrorDetails) => {
          this.loading = false;
          this.error = err;
        }
      );
  }
}
