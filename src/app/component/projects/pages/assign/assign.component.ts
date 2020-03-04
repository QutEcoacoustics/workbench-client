import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { Page } from "src/app/helpers/page/pageDecorator";
import {
  TablePage,
  TableTemplate
} from "src/app/helpers/tableTemplate/tableTemplate";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
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
export class AssignComponent extends TableTemplate<TableRow> implements OnInit {
  // TODO Move this back into the admin dashboard

  public totalSites: number;
  public pageNumber: number;
  public error: ApiErrorDetails;
  public project: Project;
  public sites: Site[];

  constructor(
    private route: ActivatedRoute,
    private sitesApi: ShallowSitesService
  ) {
    super(() => true);
  }

  ngOnInit() {
    this.columns = [
      { name: "Site Id" },
      { name: "Name" },
      { name: "Description" }
    ];

    const projectModel: ResolvedModel<Project> = this.route.snapshot.data
      .project;

    if (projectModel.error) {
      return;
    }

    this.project = projectModel.model;
    this.loadTable();
    this.getSites();
  }

  public onSelect(event) {
    console.log("Select: ", event);
  }

  public setPage(pageInfo: TablePage) {
    this.pageNumber = pageInfo.offset;
    this.getSites(pageInfo.offset);
  }

  protected createRows() {
    this.rows = [];
  }

  private getSites(page: number = 0) {
    this.rows = [];

    this.sitesApi
      .filter({ paging: { page: page + 1 } })
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        sites => {
          this.sites = sites;
          this.rows = sites.map(site => ({
            siteId: site.id,
            name: site.name,
            description: site.description
          }));

          this.pageNumber =
            this.sites.length > 0
              ? this.sites[0].getMetadata().paging.page - 1
              : 0;
          this.totalSites =
            this.sites.length > 0
              ? this.sites[0].getMetadata().paging.total
              : 0;
        },
        (err: ApiErrorDetails) => {
          this.error = err;
        }
      );
  }
}

interface TableRow {
  siteId: number;
  name: string;
  description: string;
}
