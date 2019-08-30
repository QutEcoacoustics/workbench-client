import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
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
    <div class="mt-4">
      <ng-container *ngIf="projectList$ | async as data; else loadingOrError">
        <app-cards [cards]="data"></app-cards>
      </ng-container>
      <ng-template #loadingOrError>
        <h4 class="text-center">No projects found</h4>
      </ng-template>
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
