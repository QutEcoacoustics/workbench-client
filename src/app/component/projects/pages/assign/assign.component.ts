import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { Page } from "src/app/helpers/page/pageDecorator";
import { TableTemplate } from "src/app/helpers/tableTemplate/tableTemplate";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { ShallowSitesService } from "src/app/services/baw-api/sites.service";
import {
  assignSiteMenuItem,
  projectCategory,
  projectMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: assignSiteMenuItem
})
@Component({
  selector: "app-assign",
  templateUrl: "./assign.component.html",
  styleUrls: ["./assign.component.scss"]
})
export class AssignComponent extends TableTemplate<TableRow>
  implements OnInit, OnDestroy {
  // TODO Move this back into the admin dashboard

  public totalSites: number;
  public pageNumber: number;
  public ready: boolean;
  public error: ApiErrorDetails;
  public project: Project;
  public sites: Site[];

  private unsubscribe = new Subject();

  constructor(
    private route: ActivatedRoute,
    private sitesApi: ShallowSitesService,
    private projectsApi: ProjectsService
  ) {
    super(() => true);
  }

  ngOnInit() {
    this.columns = [
      { name: "Site Id" },
      { name: "Name" },
      { name: "Description" }
    ];

    this.route.params
      .pipe(
        flatMap(params => {
          return this.projectsApi.show(params.projectId);
        }),
        flatMap(project => {
          this.project = project;
          return this.sitesApi.filter({ paging: { page: 1 } });
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        sites => {
          this.sites = sites;
          this.loadTable();
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

  public onSelect(event) {
    console.log("Select: ", event);
  }

  public setPage(pageInfo) {
    console.log("Set Page");

    this.pageNumber = pageInfo.offset;
    this.sitesApi
      .filter({ paging: { page: pageInfo.offset + 1 } })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        sites => {
          this.sites = sites;
          this.rows = sites.map(site => ({
            siteId: site.id,
            name: site.name,
            description: site.description
          }));
        },
        (err: ApiErrorDetails) => {
          this.error = err;
        }
      );
  }

  protected createRows() {
    this.rows = this.sites.map(site => ({
      siteId: site.id,
      name: site.name,
      description: site.description
    }));

    console.log("Sites: ", this.sites);

    this.pageNumber = 0;
    this.totalSites =
      this.sites.length > 0 ? this.sites[0].getMetadata().paging.total : 0;
  }
}

interface TableRow {
  siteId: number;
  name: string;
  description: string;
}
