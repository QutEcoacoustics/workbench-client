import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { forkJoin, Observable, Subject } from "rxjs";
import { map, takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { newSiteMenuItem } from "src/app/component/sites/sites.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import {
  PROJECT_TOKEN,
  SITES_TOKEN
} from "src/app/services/baw-api/baw-api.tokens";
import {
  assignSiteMenuItem,
  deleteProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  exploreAudioProjectMenuItem,
  projectCategory,
  projectMenuItem
} from "../../projects.menus";

export const projectMenuItemActions = [
  exploreAudioProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  newSiteMenuItem,
  assignSiteMenuItem,
  deleteProjectMenuItem
];

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>(projectMenuItemActions),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: projectMenuItem
})
@Component({
  selector: "app-projects-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent extends PageComponent
  implements OnInit, OnDestroy {
  public project: Project;
  public sites: Site[];
  public error: ApiErrorDetails;
  public ready = false;
  private unsubscribe = new Subject();

  constructor(
    @Inject(PROJECT_TOKEN) public projectObv: Observable<Project>,
    @Inject(SITES_TOKEN) public sitesObv: Observable<Site[]>
  ) {
    super();
  }

  ngOnInit() {
    forkJoin([this.projectObv, this.sitesObv])
      .pipe(
        map(res => {
          const [project, sites] = res;
          this.project = project;
          this.sites = sites;
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        () => {
          this.ready = true;
        },
        (err: ApiErrorDetails) => {
          this.error = err;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
