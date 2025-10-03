import {
  Component,
  inject,
  model,
  signal,
  OnInit,
  Inject,
  input,
  contentChild,
  TemplateRef,
} from "@angular/core";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { CardsComponent } from "@shared/model-cards/cards/cards.component";
import {
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavOutlet,
  NgbPagination,
} from "@ng-bootstrap/ng-bootstrap";
import { NgTemplateOutlet } from "@angular/common";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { SiteMapComponent } from "@components/projects/components/site-map/site-map.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ConfigService } from "@services/config/config.service";
import { InnerFilter } from "@baw-api/baw-api.service";
import { ApiFilter } from "@baw-api/api-common";
import { associationModelFilter } from "@helpers/filters/associations";
import { ListModel, MODEL_LIST_SERVICE } from "./model-list.tokens";

@Component({
  selector: "baw-model-list",
  templateUrl: "./model-list.component.html",
  styleUrl: "./model-list.component.scss",
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
export class ModelListComponent<Model extends ListModel>
  extends PaginationTemplate<Model>
  implements OnInit
{
  protected readonly siteConfig = inject(ConfigService);

  public readonly modelKey = input.required<string>();
  public readonly filterPlaceholder = input("Filter");

  protected readonly noResultsTemplate =
    contentChild.required<TemplateRef<HTMLElement>>("noResultsTemplate");

  protected readonly tabs = {
    tiles: 1,
    map: 2,
  } as const;

  protected readonly active = model(
    this.router.routerState?.snapshot?.root?.queryParams["tab"] === "map"
      ? this.tabs.map
      : this.tabs.tiles,
  );

  protected readonly models = signal<Model[]>([]);
  protected readonly mapFilter = signal<InnerFilter<Model> | null>(null);

  public constructor(@Inject(MODEL_LIST_SERVICE) service: ApiFilter<Model>) {
    super(
      service,
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
      const baseFilter = this.generateFilter();
      this.mapFilter.set(
        associationModelFilter(this.modelKey(), baseFilter.filter)
      );
    } else {
      this.mapFilter.set(null);
    }
  }
}
