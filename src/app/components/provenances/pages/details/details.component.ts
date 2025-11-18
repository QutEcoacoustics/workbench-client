import {
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  provenanceResolvers,
  ProvenanceService,
} from "@baw-api/provenance/provenance.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import {
  editProvenanceMenuItem,
  provenanceCategory,
  provenanceMenuItem,
  provenancesMenuItem,
} from "@components/provenances/provenances.menus";
import { deleteProvenanceModal } from "@components/provenances/provenances.modals";
import { defaultSuccessMsg } from "@helpers/formTemplate/formTemplate";
import { IPageInfo } from "@helpers/page/pageInfo";
import { PageComponent } from "@helpers/page/pageComponent";
import { Provenance } from "@models/Provenance";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { takeUntil } from "rxjs";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { DetailViewComponent } from "@shared/detail-view/detail-view.component";
import baseSchema from "../../provenance.base.schema.json";
import extendedSchema from "../../provenance.extended.schema.json";

export const provenanceMenuItemActions = [
  editProvenanceMenuItem,
  deleteProvenanceModal,
];

const provenanceKey = "provenance";

@Component({
  selector: "baw-provenance",
  templateUrl: "./details.component.html",
  imports: [DetailViewComponent],
})
class ProvenanceDetailsComponent extends PageComponent implements OnInit {
  public readonly notifications = inject(ToastService);
  protected readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly provenancesApi = inject(ProvenanceService);

  protected readonly fields = [...baseSchema.fields, ...extendedSchema.fields];
  protected readonly provenance = signal<Provenance | null>(null);

  public ngOnInit() {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    if (!hasResolvedSuccessfully(models)) {
      return;
    }
    this.provenance.set(models[provenanceKey] as Provenance);
  }

  public deleteModel(): void {
    this.provenancesApi
      .destroy(this.provenance())
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        complete: () => {
          this.notifications.success(
            defaultSuccessMsg("destroyed", this.provenance()?.name),
          );
          this.router.navigateByUrl(provenancesMenuItem.route.toRouterLink());
        },
      });
  }
}

ProvenanceDetailsComponent.linkToRoute({
  category: provenanceCategory,
  pageRoute: provenanceMenuItem,
  menus: {
    actions: List(provenanceMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [provenanceKey]: provenanceResolvers.show },
});

export { ProvenanceDetailsComponent };
