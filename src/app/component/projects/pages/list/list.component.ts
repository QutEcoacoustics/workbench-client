import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Card } from "src/app/component/shared/cards/cards.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import {
  ApiErrorDetails,
  isApiErrorDetails
} from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsResolverService } from "src/app/services/baw-api/resolvers/projects-resolver.service";
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
  resolvers: {
    projects: ProjectsResolverService
  },
  self: projectsMenuItem
})
@Component({
  selector: "app-projects-list",
  template: `
    <!-- Display project cards -->
    <ng-container *ngIf="ready">
      <ng-container *ngIf="cardList.size > 0; else noProjects">
        <app-cards [cards]="cardList"></app-cards>
      </ng-container>
      <ng-template #noProjects>
        <h4 class="text-center">Your list of projects is empty</h4>
      </ng-template>
    </ng-container>

    <app-loading [isLoading]="!ready && !error"></app-loading>
    <app-error-handler [error]="error"></app-error-handler>
  `
})
export class ListComponent extends PageComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  cardList: List<Card>;
  ready: boolean;
  error: ApiErrorDetails;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.ready = false;

    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (data: { projects: Project[] | ApiErrorDetails }) => {
        if (isApiErrorDetails(data.projects)) {
          this.error = data.projects;
          return;
        }

        this.cardList = List(data.projects.map(project => project.getCard()));
        this.ready = true;
      },
      err => {}
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
