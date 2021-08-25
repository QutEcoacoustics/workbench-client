import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import {
  newRegionMenuItem,
  shallowRegionsCategory,
  shallowRegionsMenuItem,
} from "@components/regions/regions.menus";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Region } from "@models/Region";
import { NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { Card } from "@shared/cards/cards.component";
import { List } from "immutable";

export const regionsMenuItemActions = [newRegionMenuItem];

@Component({
  selector: "baw-regions",
  template: `
    <ng-container *ngIf="!error">
      <baw-debounce-input
        label="Filter"
        placeholder="Filter Sites"
        [default]="filter"
        (filter)="onFilter($event)"
      ></baw-debounce-input>

      <baw-loading *ngIf="loading"></baw-loading>

      <ng-container *ngIf="!loading">
        <!-- Regions Exist -->
        <ng-container *ngIf="cardList.size > 0; else empty">
          <baw-cards [cards]="cardList"></baw-cards>
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
  public cardList: List<Card> = List([]);

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
        const cards = regions.map((region) => region.getCard());
        this.cardList = List(cards);
      }
    );
  }
}

ListComponent.linkComponentToPageInfo({
  category: shallowRegionsCategory,
  menus: { actions: List(regionsMenuItemActions) },
}).andMenuRoute(shallowRegionsMenuItem);

export { ListComponent };
