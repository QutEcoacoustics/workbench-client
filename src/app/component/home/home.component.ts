import { Component, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { List } from "immutable";
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
export class HomeComponent extends PageComponent implements OnInit, OnChanges {
  processList: List<Card>;
  projectList: List<Card> = List([]);
  postList: List<Card>;
  testing: string;

  constructor(private api: ProjectsService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateProjectList();
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

    this.updateProjectList();
  }

  /**
   * Update project list array
   */
  updateProjectList() {
    this.api.getFilteredList({ items: 3 }).subscribe({
      next: (data: Projects) =>
        (this.projectList = List(
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
        )),
      complete: () => console.log("complete"),
      error: err => console.error("Error: ", err)
    });
  }
}
