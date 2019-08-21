import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  editProjectMenuItem,
  projectMenuItem,
  projectsCategory
} from "../../projects.menus";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([editProjectMenuItem]),
    links: List()
  },
  self: projectMenuItem
})
@Component({
  selector: "app-projects-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent extends PageComponent implements OnInit {
  project: Project;
  sites: Site[];

  constructor(
    private route: ActivatedRoute,
    private projectsApi: ProjectsService,
    private sitesApi: SitesService
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe({
      next: data => {
        this.projectsApi.getProject(data.projectId).subscribe({
          next: project => {
            this.project = project;
          }
        });

        this.sitesApi.getProjectSites(data.projectId).subscribe({
          next: sites => {
            this.sites = sites;
          }
        });
      }
    });
  }
}
