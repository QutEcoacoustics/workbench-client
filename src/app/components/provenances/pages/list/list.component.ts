import { Component, OnInit, inject } from "@angular/core";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import {
  newProvenanceMenuItem,
  provenancesCategory,
  provenancesMenuItem,
} from "@components/provenances/provenances.menus";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
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

export const provenancesMenuItemActions = [newProvenanceMenuItem];

@Component({
  selector: "baw-provenances-list",
  templateUrl: "./list.component.html",
  imports: [
    NgxDatatableModule,
    DatatableDefaultsDirective,
    DatatablePaginationDirective,
    UrlDirective,
  ],
})
class ProvenanceListComponent extends PageComponent implements OnInit {
  private api = inject(AudioEventProvenanceService);
  private notifications = inject(ToastService);
  private modals = inject(NgbModal);

  protected filters$: BehaviorSubject<Filters<AudioEventProvenance>>;
  private defaultFilters: Filters<AudioEventProvenance> = {
    sorting: {
      direction: "desc",
      orderBy: "createdAt",
    },
  };

  public ngOnInit(): void {
    this.filters$ = new BehaviorSubject(this.defaultFilters);
  }

  protected getModels = (filters: Filters<AudioEventProvenance>) =>
    this.api.filter(filters);

  protected async deleteProvenance(
    template: any,
    model: AudioEventProvenance
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
        error: (error) => {
          this.notifications.error(`Failed to delete ${modelName}`);
        },
      });
  }
}

ProvenanceListComponent.linkToRoute({
  category: provenancesCategory,
  pageRoute: provenancesMenuItem,
  menus: { actions: List(provenancesMenuItemActions) },
});

export { ProvenanceListComponent };
