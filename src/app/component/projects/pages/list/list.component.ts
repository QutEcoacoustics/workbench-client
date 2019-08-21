import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Page } from "src/app/interfaces/pageDecorator";
import { Project } from "src/app/models/Project";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { projectsCategory, projectsMenuItem } from "../../projects.menus";

@Page({
  category: projectsCategory,
  menus: {
    actions: List(),
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
export class ListComponent implements OnInit {
  projectList$: Observable<any> = this.api.getProjects().pipe(
    map((data: Project[]) => {
      return List(
        data.map(project => {
          return {
            title: project.name,
            image: {
              url:
                "https://staging.ecosounds.org/images/project/project_span3.png",
              alt: project.name
            },
            link: "https://staging.ecosounds.org/projects/" + project.id
          };
        })
      );
    })
  );

  constructor(private api: ProjectsService) {}

  ngOnInit() {}
}
