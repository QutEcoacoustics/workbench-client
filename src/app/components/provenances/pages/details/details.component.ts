import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  audioEventProvenanceResolvers,
  AudioEventProvenanceService,
} from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
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
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { takeUntil } from "rxjs";
import { DetailViewComponent } from "@shared/detail-view/detail-view.component";
import schema from "../../provenance.schema.json";

export const provenanceMenuItemActions = [
  editProvenanceMenuItem,
  deleteProvenanceModal,
];

const provenanceKey = "provenance";

@Component({
  selector: "baw-provenance",
  template: `
    @if (provenance) {
      <h1 class="provenance-name">{{ provenance.name }}</h1>
      <baw-detail-view [model]="provenance" [fields]="fields"></baw-detail-view>
    }
  `,
  imports: [DetailViewComponent],
})
class ProvenanceDetailsComponent extends PageComponent implements OnInit {
  public provenance: AudioEventProvenance;
  public fields = schema.fields;

  public constructor(
    protected route: ActivatedRoute,
    private router: Router,
    private provenancesApi: AudioEventProvenanceService,
    public notifications: ToastService
  ) {
    super(route);
  }

  public ngOnInit() {
    const models = retrieveResolvers(this.route.snapshot.data as IPageInfo);
    if (!hasResolvedSuccessfully(models)) {
      return;
    }
    this.provenance = models[provenanceKey] as AudioEventProvenance;
  }

  public deleteModel(): void {
    this.provenancesApi
      .destroy(this.provenance)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        complete: () => {
          this.notifications.success(
            defaultSuccessMsg("destroyed", this.provenance.name)
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
  },
  resolvers: { [provenanceKey]: audioEventProvenanceResolvers.show },
});

export { ProvenanceDetailsComponent };
