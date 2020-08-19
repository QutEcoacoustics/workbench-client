import { Component, OnInit } from "@angular/core";
import { ProjectsService } from "@baw-api/project/projects.service";
import { SecurityService } from "@baw-api/security/security.service";
import { projectsMenuItem } from "@components/projects/projects.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { Project } from "@models/Project";
import { AppConfigService } from "@services/app-config/app-config.service";
import { Card } from "@shared/cards/cards.component";
import { List } from "immutable";
import { map, mergeMap, takeUntil } from "rxjs/operators";
import { homeCategory, homeMenuItem } from "./home.menus";

@Component({
  selector: "app-home",
  template: `
    <baw-cms [page]="page"></baw-cms>
    <div class="container-fluid" style="background-color: #e9ecef;">
      <section class="container">
        <h2>
          Some of the projects you can access
        </h2>
        <p>
          You can browse some public projects and audio recordings without
          logging in. To participate in the analysis work you will need to Log
          in with an existing account or Register for a new account.
        </p>
        <baw-cards [cards]="projectList">
          <ng-container>
            <button
              class="m-auto btn btn-outline-primary"
              [routerLink]="projectsLink"
            >
              More Projects
            </button>
          </ng-container>
        </baw-cards>
      </section>
    </div>
  `,
})
class HomeComponent extends PageComponent implements OnInit {
  public page: string;
  public projectsLink = projectsMenuItem.route.toString();
  public projectList: List<Card> = List([]);

  constructor(
    private env: AppConfigService,
    private projectApi: ProjectsService,
    private securityApi: SecurityService
  ) {
    super();
  }

  public ngOnInit() {
    this.page = this.env.values.cms.home;

    this.securityApi
      .getAuthTrigger()
      .pipe(
        mergeMap(() => this.projectApi.filter({ paging: { items: 3 } })),
        map((data: Project[]) =>
          List(data.map((project) => project.getCard()))
        ),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (cards: List<Card>) => (this.projectList = cards),
        () => (this.projectList = List([]))
      );
  }
}

HomeComponent.LinkComponentToPageInfo({
  category: homeCategory,
  fullscreen: true,
}).AndMenuRoute(homeMenuItem);

export { HomeComponent };
