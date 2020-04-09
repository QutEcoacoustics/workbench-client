import {
  newProjectMenuItem,
  requestProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
} from "@component/projects/projects.menus";
import { Page } from "@helpers/page/pageDecorator";
import { List } from "immutable";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { projectResolvers } from "@baw-api/projects.service";
import { Component, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { Card } from "@shared/cards/cards.component";
import { ActivatedRoute } from "@angular/router";
import { ResolvedModel } from "@baw-api/resolver-common";
import { Project } from "@models/Project";

export const projectsMenuItemActions = [
  newProjectMenuItem,
  requestProjectMenuItem,
];

const projectsKey = "projects";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>(projectsMenuItemActions),
    links: List(),
  },
  resolvers: {
    [projectsKey]: projectResolvers.list,
  },
  self: projectsMenuItem,
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
  `,
})
export class ListComponent extends PageComponent implements OnInit {
  public cardList: List<Card>;

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    const projects: ResolvedModel<Project[]> = this.route.snapshot.data[
      projectsKey
    ];

    if (projects.error) {
      return;
    }

    this.cardList = List(projects.model.map((project) => project.getCard()));
  }
}
