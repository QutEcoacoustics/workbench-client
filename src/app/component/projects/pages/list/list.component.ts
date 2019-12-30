import { Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { Card } from "src/app/component/shared/cards/cards.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem
} from "../../projects.menus";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([newProjectMenuItem, requestProjectMenuItem]),
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

    <!-- Display loading animation -->
    <ng-container *ngIf="loading">
      <h4 class="text-center">Loading</h4>
      <div class="d-flex justify-content-center">
        <mat-spinner diameter="30" strokeWidth="4"></mat-spinner>
      </div>
    </ng-container>

    <!-- Error handler -->
    <app-error-handler [error]="error"></app-error-handler>
  `
})
export class ListComponent extends PageComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  cardList: List<Card>;
  loading: boolean;
  error: APIErrorDetails;

  constructor(private api: ProjectsService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.api
      .getProjects()
      .pipe(
        map((data: Project[]) => {
          return List(data.map(project => project.card));
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (projects: List<Card>) => {
          this.cardList = projects;
          this.loading = false;
        },
        (err: APIErrorDetails) => {
          this.loading = false;
          this.error = err;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
