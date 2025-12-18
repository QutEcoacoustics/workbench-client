import { Component, inject, model, signal, OnInit, input, contentChild, TemplateRef } from "@angular/core";
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
import { AssociationKind, InnerFilter } from "@baw-api/baw-api.service";
import { ApiFilter } from "@baw-api/api-common";
import { associationModelFilter } from "@helpers/filters/associations";
import { Site } from "@models/Site";
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

  public readonly modelKey = input.required<AssociationKind>();
  public readonly filterPlaceholder = input("Filter");

  protected readonly noResultsTemplate =
    contentChild.required<TemplateRef<HTMLElement>>("noResultsTemplate");

  protected readonly tabs = {
    tiles: "tiles",
    map: "map",
  } as const;

  protected readonly active = model(
    this.router.routerState?.snapshot?.root?.queryParams["tab"] ??
      this.tabs.tiles,
  );

  protected readonly models = signal<Model[]>([]);
  protected readonly mapFilter = signal<InnerFilter<Model> | null>(null);

  // This doesn't need to be a signal because it doesn't change after the first
  // render.
  protected groupBy: keyof Site;

  public constructor() {
    const service = inject<ApiFilter<Model>>(MODEL_LIST_SERVICE);

    super(
      service,
      "name",
      () => [],
      (fetchedModels) => {
        this.models.set(fetchedModels);
        this.updateMapFilters();
      },
    );
  }

  public ngOnInit() {
    super.ngOnInit();

    const isProjectList = this.modelKey() === "project";
    this.groupBy = isProjectList ? "projectIds" : "regionId";

    this.active.subscribe((active) => {
      const tab = active === this.tabs.tiles ? null : active;
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
        associationModelFilter(this.modelKey(), baseFilter.filter),
      );
    } else {
      this.mapFilter.set(null);
    }
  }
}
