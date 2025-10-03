import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import {
  newProvenanceMenuItem,
  provenancesCategory,
  provenancesMenuItem,
} from "@components/provenances/provenances.menus";
import { PaginationTemplate } from "@helpers/paginationTemplate/paginationTemplate";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { NgbPaginationConfig, NgbPagination } from "@ng-bootstrap/ng-bootstrap";
import { List } from "immutable";
import { CardsComponent } from "@shared/model-cards/cards/cards.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";

export const provenancesMenuItemActions = [newProvenanceMenuItem];

@Component({
  selector: "baw-provenances-list",
  template: `
    @if (!error) {
      <label class="input-group mb-3">
        <span class="input-group-prepend input-group-text">Filter</span>
        <input
          bawDebouncedInput
          type="text"
          class="form-control"
          placeholder="Filter Provenances"
          [value]="filter"
          (valueChange)="onFilter($event)"
        >
      </label>

      @if (!loading) {
        <!-- Provenances Exist -->
        @if (models.size > 0) {
          <baw-model-cards [models]="models"></baw-model-cards>
        } @else {
          <h4 class="text-center">Your list of provenances is empty</h4>
        }
        <!-- Provenances Don't Exist -->
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
  imports: [
    DebouncedInputDirective,
    CardsComponent,
    NgbPagination,
    ErrorHandlerComponent,
  ],
})
class ProvenanceListComponent extends PaginationTemplate<AudioEventProvenance> {
  public models: List<AudioEventProvenance> = List([]);

  public constructor(
    router: Router,
    route: ActivatedRoute,
    config: NgbPaginationConfig,
    provenancesService: AudioEventProvenanceService
  ) {
    super(
      router,
      route,
      config,
      provenancesService,
      "name",
      () => [],
      (provenances) => {
        this.models = List(provenances);
      }
    );
  }
}

ProvenanceListComponent.linkToRoute({
  category: provenancesCategory,
  pageRoute: provenancesMenuItem,
  menus: { actions: List(provenancesMenuItemActions) },
});

export { ProvenanceListComponent };
