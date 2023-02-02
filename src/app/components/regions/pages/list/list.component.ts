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
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";

export const regionsMenuItemActions = [
  shallowNewRegionMenuItem,
  audioRecordingMenuItems.list.base,
  audioRecordingMenuItems.batch.base,
];

@Component({
  selector: "baw-regions",
  template: `
    <ng-container *ngIf="!error">
      <ng-container *ngIf="!loading && models.size > 0;">
        <div style="width: 100%; height: 500px;">
          <baw-site-map [regions]="models.toArray()"></baw-site-map>
        </div>
      </ng-container>

      <baw-debounce-input
        label="Filter"
        placeholder="Filter Sites"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <ng-container *ngIf="!loading">
        <!-- Regions Exist -->
        <ng-container *ngIf="models.size > 0; else empty">
          <baw-model-cards [models]="models"></baw-model-cards>
        </ng-container>

        <!-- Regions Don't Exist -->
        <ng-template #empty>
          <h4 class="text-center">Your list of sites is empty</h4>
        </ng-template>
      </ng-container>

      <ngb-pagination
        *ngIf="displayPagination"
        aria-label="Pagination Buttons"
        class="mt-2 d-flex justify-content-end"
        [collectionSize]="collectionSize"
        [(page)]="page"
      ></ngb-pagination>
    </ng-container>
    <baw-error-handler [error]="error"></baw-error-handler>
  `,
})
class ListComponent extends PaginationTemplate<Region> implements OnInit {
  public models: List<Region> = List([]);

  public constructor(
    router: Router,
    route: ActivatedRoute,
    config: NgbPaginationConfig,
    regionsService: ShallowRegionsService
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
      }
    );
  }
}

ListComponent.linkToRoute({
  category: shallowRegionsCategory,
  pageRoute: shallowRegionsMenuItem,
  menus: { actions: List(regionsMenuItemActions) },
});

export { ListComponent };
