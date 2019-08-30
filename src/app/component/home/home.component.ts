import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { Project } from "src/app/models/Project";
import { AppConfigService } from "src/app/services/app-config/app-config.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { projectsMenuItem } from "../projects/projects.menus";
import { Card } from "../shared/cards/cards.component";
import { homeCategory, homeMenuItem } from "./home.menus";

@Page({
  category: homeCategory,
  fullscreen: true,
  menus: null,
  self: homeMenuItem
})
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent extends PageComponent implements OnInit {
  moreProjectsLink = projectsMenuItem;
  processList: List<Card>;
  projectList$: Observable<any> = this.api
    .getFilteredProjects({ items: 3 })
    .pipe(
      map((data: Project[]) => {
        return List(data.map(project => project.card));
      })
    );
  title: string;
  researchAboutUrl: string;

  constructor(
    private api: ProjectsService,
    private appConfig: AppConfigService
  ) {
    super();
  }

  ngOnInit() {
    const config = this.appConfig.getConfig();
    this.title = config.values.brand.title;

    // Find research about url
    this.researchAboutUrl = this.appConfig.getContentUrl(
      config.values.content,
      ["Research", "About"]
    );

    this.processList = List([
      {
        title: "Environment",
        description:
          "Faunal vocalisations and other human-audible environmental sounds"
      },
      {
        title: "Acoustic Sensors",
        description:
          "Acoustic sensors record sound in a wide range of environments"
      },
      {
        title: "Annotated Spectrogram",
        description:
          "Practical identification of animal sounds by people and automated detectors. " +
          "Ecologists use these to answer environmental questions."
      }
    ]);
  }
}
