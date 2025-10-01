import {
  Component,
  inject,
  model,
  OnInit,
  signal,
} from "@angular/core";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  shallowNewRegionMenuItem,
  shallowRegionsCategory,
  shallowRegionsMenuItem,
} from "@components/regions/regions.menus";
import {
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavOutlet,
  NgbPagination,
  NgbPaginationConfig,
} from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ActivatedRoute, Router } from "@angular/router";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { ConfigService } from "@services/config/config.service";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { InnerFilter } from "@baw-api/baw-api.service";
import { Site } from "@models/Site";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Region } from "@models/Region";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { CardsComponent } from "@shared/model-cards/cards/cards.component";
import { NgTemplateOutlet } from "@angular/common";

export const regionsMenuItemActions = [
  shallowNewRegionMenuItem,
  audioRecordingMenuItems.list.base,
  audioRecordingMenuItems.batch.base,
];

@Component({
  selector: "baw-regions",
  templateUrl: "./list.component.html",
  styleUrl: "./list.component.scss",
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    NgbNavOutlet,
    FaIconComponent,
    SiteMapComponent,
    DebouncedInputDirective,
    NgTemplateOutlet,
    NgbPagination,
    CardsComponent,
  ],
})
class RegionListComponent extends PaginationTemplate<Region> implements OnInit {
  protected readonly siteConfig = inject(ConfigService);

  protected readonly tabs = {
    tiles: 1,
    map: 2,
  } as const;

  protected readonly active = model(
    this.router.routerState.snapshot.root.queryParams["tab"] === "map"
      ? this.tabs.map
      : this.tabs.tiles,
  );

  protected readonly models = signal<Region[]>([]);
  protected readonly mapFilter = signal<InnerFilter<Site> | null>(null);


  public constructor(
    router: Router,
    route: ActivatedRoute,
    paginationTemplate: NgbPaginationConfig,
    regionsService: ShallowRegionsService,
  ) {
    super(
      router,
      route,
      paginationTemplate,
      regionsService,
      "name",
      () => [],
      (regions) => {
        this.models.set(regions);
        this.updateMapFilters();
      },
    );
  }

  public ngOnInit() {
    super.ngOnInit();

    this.active.subscribe((active) => {
      const tab = active === this.tabs.tiles ? null : "map";
      const queryParams = { tab };

      this.router.navigate([], {
        queryParams,
        queryParamsHandling: "merge",
      });
    });
  }

  private updateMapFilters(): void {
    const textFilter = this.filter;
    if (textFilter) {
      this.mapFilter.set({ "regions.name": { contains: textFilter } } as any);
    } else {
      this.mapFilter.set(null);
    }
  }
}

RegionListComponent.linkToRoute({
  category: shallowRegionsCategory,
  pageRoute: shallowRegionsMenuItem,
  menus: { actions: List(regionsMenuItemActions) },
});

export { RegionListComponent };
