import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Page } from "src/app/interfaces/pageDecorator";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { projectMenuItem, projectsCategory } from "../../projects.menus";

@Page({
  category: projectsCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: projectMenuItem
})
@Component({
  selector: "app-projects-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private api: ProjectsService) {}

  ngOnInit() {
    this.route.queryParamMap.subscribe({
      next: queryParams => {
        console.debug(queryParams);
        const projectId = queryParams.get("projectId");
        console.debug(projectId);
      }
    });

    this.api.getProject(512).subscribe({
      next: data => console.debug(data)
    });
  }
}
