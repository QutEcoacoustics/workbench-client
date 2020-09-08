import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
import { debounceTime, map, mergeMap, takeUntil } from "rxjs/operators";

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
  public project: Project;
  public sites: List<Site> = List([]);
  public markers: MapMarkerOption[];
  public loading: boolean;
  private page = 1;
  private sites$ = new Subject<void>();
  private filter$ = new Subject<void>();
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

    const errorHandler = (error) => {
      console.error(error);
      this.loading = false;
    };

    this.sites$
      .pipe(
        mergeMap(() => this.getSites()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(noop, errorHandler);

    this.filter$
      .pipe(
        debounceTime(500),
        map(() => {
          this.markers = [];
          this.page = 1;
        }),
        mergeMap(() => this.getSites()),
        takeUntil(this.unsubscribe)
      )
      .subscribe(noop, errorHandler);

    this.sites$.next();
  }

  public onScroll() {
    this.page++;
    this.sites$.next();
  }

  public onFilter(input: string) {
    this.page = 1;
    this.filter = input ? { name: { contains: input } } : undefined;
    this.filter$.next();
  }

  private getSites() {
    this.loading = true;
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
            sites.map((site) => site.getMapMarker())
          );
          this.loading = false;
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
