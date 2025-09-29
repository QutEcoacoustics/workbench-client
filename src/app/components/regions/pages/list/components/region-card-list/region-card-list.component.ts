import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { Region } from "@models/Region";
import { NgbPagination, NgbPaginationConfig } from "@ng-bootstrap/ng-bootstrap";
import { CardsComponent } from "@shared/model-cards/cards/cards.component";

@Component({
  selector: "baw-region-card-list",
  templateUrl: "./region-card-list.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DebouncedInputDirective, CardsComponent, NgbPagination],
})
export class RegionCardListComponent
  extends PaginationTemplate<Region>
  implements OnInit
{
  protected readonly models = signal<Region[]>([]);

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
        this.models.set(regions);
      },
    );
  }
}
