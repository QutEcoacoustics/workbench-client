import { Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Category } from "src/app/interfaces/layout-menus.interfaces";
import { Page, PageComponent } from "src/app/interfaces/page.decorator";
import {
  Projects,
  ProjectsService
} from "src/app/services/baw-api/projects.service";
import { Card } from "../shared/cards/cards.component";

export const homeCategory: Category = {
  icon: ["fas", "home"],
  label: "Home",
  route: "home"
};

@Page({
  icon: ["fas", "home"],
  label: "Home",
  category: homeCategory,
  routeFragment: "home",
  route: "/" + homeCategory.route,
  tooltip: () => "Home page",
  predicate: user => !user,
  order: { priority: 1, indentation: 0 },
  menus: null,
  fullscreen: true
})
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent extends PageComponent implements OnInit {
  processList: List<Card>;
  updateProjectList$: Observable<any> = this.projectsApi
    .getFilteredProjects({ items: 3 })
    .pipe(
      map((data: Projects) => {
        return List(
          data.data.map(project => {
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

  constructor(private projectsApi: ProjectsService) {
    super();
  }

  ngOnInit() {
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
