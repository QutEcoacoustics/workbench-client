import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Card } from "src/app/component/shared/cards/cards.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsResolverService } from "src/app/services/baw-api/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem
} from "../../projects.menus";
import { ActivatedRoute } from "@angular/router";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";

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
    <ng-container *ngIf="cardList">
      <ng-container *ngIf="cardList.size > 0; else noProjects">
        <app-cards [cards]="cardList"></app-cards>
      </ng-container>
      <ng-template #noProjects>
        <h4 class="text-center">Your list of projects is empty</h4>
      </ng-template>
    </ng-container>

    <app-loading [isLoading]="!cardList && !error"></app-loading>
    <app-error-handler [error]="error"></app-error-handler>
  `
})
export class ListComponent extends PageComponent implements OnInit {
  cardList: List<Card>;
  error: ApiErrorDetails;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const projects: ResolvedModel<Project[]> = this.route.snapshot.data
      .projects;

    if (projects.error) {
      this.error = projects.error;
      return;
    }

    this.cardList = List(projects.model.map(project => project.getCard()));
  }
}
