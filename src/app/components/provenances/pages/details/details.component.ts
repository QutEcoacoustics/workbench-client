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
      <div class="row mb-3">
        <div class="col-sm-12">
          <dl class="row">
            <dt class="col-sm-3">Version</dt>
            <dd class="col-sm-9">{{ provenance.version }}</dd>

            <dt class="col-sm-3">Description</dt>
            <dd class="col-sm-9" [innerHTML]="provenance.descriptionHtml || defaultDescription"></dd>

            <dt class="col-sm-3">Score Minimum</dt>
            <dd class="col-sm-9">{{ provenance.scoreMinimum ?? 'N/A' }}</dd>

            <dt class="col-sm-3">Score Maximum</dt>
            <dd class="col-sm-9">{{ provenance.scoreMaximum ?? 'N/A' }}</dd>
          </dl>
        </div>
      </div>
    }
  `,
})
class ProvenanceDetailsComponent extends PageComponent implements OnInit {
  public defaultDescription = "<i>No description found</i>";
  public provenance: AudioEventProvenance;

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
