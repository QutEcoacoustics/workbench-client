import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { newSiteMenuItem } from "src/app/component/sites/sites.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import {
  ApiErrorDetails,
  isApiErrorDetails
} from "src/app/services/baw-api/api.interceptor.service";
import { ProjectResolverService } from "src/app/services/baw-api/resolvers/projects-resolver.service";
import { SitesResolverService } from "src/app/services/baw-api/resolvers/sites-resolver.service";
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
  resolvers: {
    project: ProjectResolverService,
    sites: SitesResolverService
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

  constructor(private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.ready = false;

    this.route.data.pipe(takeUntil(this.unsubscribe)).subscribe(
      (data: {
        project: Project | ApiErrorDetails;
        sites: Site[] | ApiErrorDetails;
      }) => {
        console.log("Data: ", data);

        if (isApiErrorDetails(data.project)) {
          this.error = data.project;
          return;
        }
        if (isApiErrorDetails(data.sites)) {
          this.error = data.sites;
          return;
        }

        this.project = data.project;
        this.sites = data.sites;
        this.ready = true;
      },
      err => {}
    );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
