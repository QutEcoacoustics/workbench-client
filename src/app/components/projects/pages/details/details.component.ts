import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
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
import { ISite, Site } from "@models/Site";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { MapMarkerOption, sanitizeMapMarkers } from "@shared/map/map.component";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { combineLatest, noop, Observable } from "rxjs";
import { map } from "rxjs/operators";

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
  public markers: List<MapMarkerOption>;
  public project: Project;
  public sites: List<Site> = List([]);

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
        this.markers = this.markers.concat(
          sanitizeMapMarkers(sites.map((site) => site.getMapMarker()))
        );
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
  }

  protected getModels() {
    this.markers = List([]);
    return super.getModels().pipe(
      map((models) => {
        this.getMarkers(models);
        return models;
      })
    );
  }

  private getMarkers(models: Site[]) {
    const numPages = models?.[0]?.getMetadata()?.paging.maxPage || 1;
    const currentPage = models?.[0]?.getMetadata()?.paging.page || 1;
    const observables: Observable<Site[]>[] = [];

    for (let page = 1; page <= numPages; page++) {
      // Skip current page
      if (page === currentPage) {
        continue;
      }

      observables.push(this.api.filter(this.generateFilter(), this.project));
    }

    return combineLatest(observables).subscribe((responses) => {
      const markers: google.maps.ReadonlyMarkerOptions[] = [];
      responses.forEach((sites) => {
        markers.push(...sites.map((site) => site.getMapMarker()));
      });
      this.markers = this.markers.concat(sanitizeMapMarkers(markers));
    }, noop);
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
