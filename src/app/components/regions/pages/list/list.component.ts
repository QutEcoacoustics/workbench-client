import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnInit,
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
} from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { PageComponent } from "@helpers/page/pageComponent";
import { Router } from "@angular/router";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { ConfigService } from "@services/config/config.service";
import { RegionMapComponent } from "./components/region-map/region-map.component";
import { RegionCardListComponent } from "./components/region-card-list/region-card-list.component";

export const regionsMenuItemActions = [
  shallowNewRegionMenuItem,
  audioRecordingMenuItems.list.base,
  audioRecordingMenuItems.batch.base,
];

@Component({
  selector: "baw-regions",
  templateUrl: "./list.component.html",
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    NgbNavOutlet,
    FaIconComponent,
    RegionMapComponent,
    RegionCardListComponent,
    DebouncedInputDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RegionListComponent extends PageComponent implements OnInit {
  protected readonly config = inject(ConfigService);
  private readonly router = inject(Router);

  protected readonly tabs = {
    tiles: 1,
    map: 2,
  } as const;

  protected readonly active = model(
    this.router.routerState.snapshot.root.queryParams["tab"] === "map"
      ? this.tabs.map
      : this.tabs.tiles,
  );

  protected readonly filter = model("");

  public ngOnInit() {
    this.active.subscribe((active) => {
      const tab = active === this.tabs.tiles ? null : "map";
      const queryParams = { tab };

      this.router.navigate([], {
        queryParams,
        queryParamsHandling: "merge",
      });
    });
  }
}

RegionListComponent.linkToRoute({
  category: shallowRegionsCategory,
  pageRoute: shallowRegionsMenuItem,
  menus: { actions: List(regionsMenuItemActions) },
});

export { RegionListComponent };
