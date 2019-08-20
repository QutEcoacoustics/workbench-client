import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { Project } from "src/app/models/Project";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
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
  processList: List<Card>;
  updateProjectList$: Observable<any> = this.api
    .getFilteredProjects({ items: 3 })
    .pipe(
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

  constructor(private api: ProjectsService) {
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

    this.api.getProject(512).subscribe(data => console.debug(data));
  }
}
