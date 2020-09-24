import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
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
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { MapMarkerOption, sanitizeMapMarkers } from "@shared/map/map.component";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { combineLatest, Observable } from "rxjs";
import { map, switchMap, takeUntil } from "rxjs/operators";

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
class DetailsComponent extends PaginationTemplate<Site> implements OnInit {
  public markers: List<MapMarkerOption> = List([]);
  public project: Project;
  public sites: List<Site> = List([]);
  protected api: SitesService;

  constructor(
    route: ActivatedRoute,
    router: Router,
    config: NgbPaginationConfig,
    sitesService: SitesService
  ) {
    super(
      router,
      route,
      config,
      sitesService,
      "name",
      () => [this.project.id],
      (sites) => {
        this.sites = List(sites);
      }
    );
  }

  public ngOnInit() {
    const resolvedModels = retrieveResolvers(this.route.snapshot.data);
    if (!resolvedModels) {
      return;
    }
    this.project = resolvedModels[projectKey] as Project;
    super.ngOnInit();

    this.api
      .filter({}, this.project)
      .pipe(
        switchMap((models) => this.getMarkers(models)),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (markers) =>
          (this.markers = this.markers.concat(sanitizeMapMarkers(markers))),
        (error: ApiErrorDetails) => {
          this.error = error;
          this.loading = false;
        }
      );
  }

  private getMarkers(sites: Site[]) {
    const numPages = sites?.[0]?.getMetadata()?.paging?.maxPage || 1;
    const observables: Observable<Site[]>[] = [];

    for (let page = 2; page <= numPages; page++) {
      observables.push(this.api.filter({ paging: { page } }, this.project));
    }

    return combineLatest(observables).pipe(
      map((responses) => {
        const markers = sites.map((site) => site.getMapMarker());
        responses.forEach((response) => {
          markers.push(...response.map((site) => site.getMapMarker()));
        });
        return markers;
      })
    );
  }
}

DetailsComponent.LinkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List([projectsMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: { [projectKey]: projectResolvers.show },
}).AndMenuRoute(projectMenuItem);

export { DetailsComponent };
