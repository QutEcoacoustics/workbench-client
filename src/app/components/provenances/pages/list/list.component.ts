import { Component, OnInit, inject } from "@angular/core";
import { ProvenanceService } from "@baw-api/provenance/provenance.service";
import {
  newProvenanceMenuItem,
  provenanceCategory,
  provenancesMenuItem,
} from "@components/provenances/provenances.menus";
import { Provenance } from "@models/Provenance";
import { List } from "immutable";
import { PageComponent } from "@helpers/page/pageComponent";
import { BehaviorSubject, takeUntil } from "rxjs";
import { Filters } from "@baw-api/baw-api.service";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DatatableDefaultsDirective } from "@directives/datatable/defaults/defaults.directive";
import { DatatablePaginationDirective } from "@directives/datatable/pagination/pagination.directive";
import { UrlDirective } from "@directives/url/url.directive";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toasts/toasts.service";
import { Id } from "@interfaces/apiInterfaces";
import { UserLinkComponent } from "@shared/user-link/user-link.component";

export const provenancesMenuItemActions = [newProvenanceMenuItem];

@Component({
  selector: "baw-provenances-list",
  templateUrl: "./list.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    DatatablePaginationDirective,
    UrlDirective,
    UserLinkComponent,
  ],
})
class ProvenanceListComponent extends PageComponent implements OnInit {
  private readonly api = inject(ProvenanceService);
  private readonly notifications = inject(ToastService);
  private readonly modals = inject(NgbModal);

  protected filters$: BehaviorSubject<Filters<Provenance>>;
  private defaultFilters: Filters<Provenance> = {
    sorting: {
      direction: "desc",
      orderBy: "createdAt",
    },
  };

  public ngOnInit(): void {
    this.filters$ = new BehaviorSubject(this.defaultFilters);
  }

  protected getModels = (filters: Filters<Provenance>) =>
    this.api.filter(filters);

  protected async deleteProvenance(
    template: any,
    model: Provenance
  ): Promise<void> {
    const modelId: Id = model.id;
    const modelName: string = model.name;

    const ref: NgbModalRef = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (!success) {
      return;
    }

    this.api
      .destroy(modelId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          this.filters$.next(this.defaultFilters);
          this.notifications.success(`Successfully destroyed ${modelName}`);
        },
        error: () => {
          this.notifications.error(`Failed to delete ${modelName}`);
        },
      });
  }
}

ProvenanceListComponent.linkToRoute({
  category: provenanceCategory,
  pageRoute: provenancesMenuItem,
  menus: { actions: List(provenancesMenuItemActions) },
});

export { ProvenanceListComponent };
