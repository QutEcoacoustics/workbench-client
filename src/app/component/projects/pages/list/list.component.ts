import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { Project } from "src/app/models/Project";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem
} from "../../projects.menus";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([newProjectMenuItem]),
    links: List()
  },
  self: projectsMenuItem
})
@Component({
  selector: "app-projects-list",
  template: `
    <div class="mt-4">
      <app-cards [cards]="projectList$ | async"></app-cards>
    </div>
  `
})
export class ListComponent extends PageComponent implements OnInit {
  projectList$: Observable<any> = this.api.getProjects().pipe(
    map((data: Project[]) => {
      return List(data.map(project => project.card));
    })
  );

  constructor(private api: ProjectsService) {
    super();
  }

  ngOnInit() {}
}
