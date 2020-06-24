import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem,
} from "@component/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import { Card } from "@shared/cards/cards.component";
import { List } from "immutable";

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
        <baw-cards [cards]="cardList"></baw-cards>
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
