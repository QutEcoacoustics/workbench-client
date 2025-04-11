import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import {
  shallowNewRegionMenuItem,
  shallowRegionsCategory,
  shallowRegionsMenuItem,
} from "@components/regions/regions.menus";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Region } from "@models/Region";
import { NgbPaginationConfig, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";
import { DebounceInputComponent } from "../../../shared/debounce-input/debounce-input.component";
import { CardsComponent } from "../../../shared/model-cards/cards/cards.component";
import { ErrorHandlerComponent } from "../../../shared/error-handler/error-handler.component";

export const regionsMenuItemActions = [
  shallowNewRegionMenuItem,
  audioRecordingMenuItems.list.base,
  audioRecordingMenuItems.batch.base,
];

@Component({
  selector: "baw-regions",
  template: `
    @if (!error) {
      <baw-debounce-input
        label="Filter"
        placeholder="Filter Sites"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      @if (!loading) {
        <!-- Regions Exist -->
        @if (models.size > 0) {
          <baw-model-cards [models]="models"></baw-model-cards>
        } @else {
          <h4 class="text-center">Your list of sites is empty</h4>
        }
        <!-- Regions Don't Exist -->
      }

      @if (displayPagination) {
        <ngb-pagination
          aria-label="Pagination Buttons"
          class="mt-2 d-flex justify-content-end"
          [collectionSize]="collectionSize"
          [(page)]="page"
        ></ngb-pagination>
      }
    }
    <baw-error-handler [error]="error"></baw-error-handler>
  `,
  imports: [DebounceInputComponent, CardsComponent, NgbPagination, ErrorHandlerComponent],
})
class ListComponent extends PaginationTemplate<Region> implements OnInit {
  public models: List<Region> = List([]);

  public constructor(
    router: Router,
    route: ActivatedRoute,
    config: NgbPaginationConfig,
    regionsService: ShallowRegionsService,
  ) {
    super(
      router,
      route,
      config,
      regionsService,
      "name",
      () => [],
      (regions) => {
        this.models = List(regions);
      },
    );
  }
}

ListComponent.linkToRoute({
  category: shallowRegionsCategory,
  pageRoute: shallowRegionsMenuItem,
  menus: { actions: List(regionsMenuItemActions) },
});

export { ListComponent };
