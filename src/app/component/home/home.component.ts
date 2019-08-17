import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subscription } from "rxjs";
import { Category } from "src/app/interfaces/menus.interfaces";
import { MenuRoute } from "src/app/interfaces/menus.interfaces";
import { Page } from "src/app/interfaces/page.decorator";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { StrongRoute } from "src/app/interfaces/strongRoute";
import {
  Projects,
  ProjectsService
} from "src/app/services/baw-api/projects.service";
import { SecurityService } from "src/app/services/baw-api/security.service";
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
export class HomeComponent extends PageComponent implements OnInit, OnDestroy {
  processList: List<Card>;
  projectList: List<Card> = List([]);
  postList: List<Card>;
  testing: string;
  loggedInSubscription: Subscription;

  constructor(
    private projectsApi: ProjectsService,
    private securityApi: SecurityService,
    private ref: ChangeDetectorRef
  ) {
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

    this.loggedInSubscription = this.securityApi
      .getLoggedInTrigger()
      .subscribe(() => {
        this.updateProjectList();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from logged in changes after destruction
    if (this.loggedInSubscription) {
      this.loggedInSubscription.unsubscribe();
    }
  }

  /**
   * Update project list array
   */
  updateProjectList() {
    this.projectsApi.getFilteredList({ items: 3 }).subscribe({
      next: (data: Projects) => {
        this.projectList = List(
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
      },
      complete: () => {
        this.ref.detectChanges();
      },
      error: err => console.error("Error: ", err)
    });
  }
}
