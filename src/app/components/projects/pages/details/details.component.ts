import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { InnerFilter } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import {
  assignSiteMenuItem,
  deleteProjectMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem,
} from "@components/projects/projects.menus";
import { newSiteMenuItem } from "@components/sites/sites.menus";
import { exploreAudioMenuItem } from "@helpers/page/externalMenus";
import { PageComponent } from "@helpers/page/pageComponent";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { Project } from "@models/Project";
import { ISite, Site } from "@models/Site";
import { MapMarkerOption, sanitizeMapMarkers } from "@shared/map/map.component";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { noop, Subject } from "rxjs";
import { map, mergeMap, takeUntil } from "rxjs/operators";

export const projectMenuItemActions = [
  exploreAudioMenuItem,
  editProjectMenuItem,
  editProjectPermissionsMenuItem,
  newSiteMenuItem,
  assignSiteMenuItem,
  deleteProjectMenuItem,
];

const projectKey = "project";

@Component({
  selector: "app-projects-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
class DetailsComponent extends PageComponent implements OnInit {
  public error: ApiErrorDetails;
  public disableScroll: boolean;
  public loading: boolean;
  public markers: MapMarkerOption[];
  public project: Project;
  public sites: List<Site> = List([]);
  private page = 1;
  private sites$ = new Subject<void>();
  private filter: InnerFilter<ISite>;

  constructor(private route: ActivatedRoute, private api: SitesService) {
    super();
  }

  public ngOnInit() {
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);
    if (!resolvedModels) {
      return;
    }
    this.project = resolvedModels[projectKey] as Project;

    this.loading = true;
    this.sites$
      .pipe(
        mergeMap(() => this.getSites()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(noop, (error: ApiErrorDetails) => {
        console.error(error);
        this.loading = false;
        this.error = error;
      });
    this.sites$.next();
  }

  public onScroll() {
    this.page++;
    this.loading = true;
    this.sites$.next();
  }

  public onFilter(input: string) {
    this.page = 1;
    this.sites = List([]);
    this.loading = true;
    this.filter = input ? { name: { contains: input } } : undefined;
    this.sites$.next();
  }

  private getSites() {
    return this.api
      .filter(
        {
          paging: { page: this.page },
          filter: this.filter,
        },
        this.project
      )
      .pipe(
        map((sites) => {
          this.sites = this.sites.push(...sites);
          this.markers = sanitizeMapMarkers(
            this.sites.toArray().map((site) => site.getMapMarker())
          );
          this.loading = false;
          this.disableScroll =
            sites.length === 0 ||
            sites[0].getMetadata().paging.maxPage === this.page;
        })
      );
  }
}

DetailsComponent.LinkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
}).AndMenuRoute(projectMenuItem);

export { DetailsComponent };
