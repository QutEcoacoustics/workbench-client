import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountsService } from "@baw-api/account/accounts.service";
import { ApiShow } from "@baw-api/api-common";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ShallowRegionsService } from "@baw-api/region/regions.service";
import { ShallowSitesService } from "@baw-api/site/sites.service";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { AbstractModel } from "@models/AbstractModel";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { User } from "@models/User";
import { takeUntil } from "rxjs/operators";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";

@Component({
  selector: "baw-data-request",
  template: `
    <!-- Display content if there is no errors -->
    <ng-container *ngIf="!error">
      <h1>Data Request</h1>

      <!-- Display forms if all loading completed -->
      <ng-container *ngIf="!loadingModel && !error">
        <h2 class="text-center">Annotations Download</h2>
        <ng-container *ngIf="canRequestAnnotations; else placeholder">
          <baw-request-annotations
            [user]="user"
            [site]="site"
            [region]="region"
          ></baw-request-annotations>
        </ng-container>

        <baw-request-custom></baw-request-custom>
      </ng-container>
    </ng-container>

    <!-- Template placeholder for how to request annotations -->
    <ng-template #placeholder>
      <p>To download a standard CSV of annotations</p>
      <ol>
        <li>Navigate to the project you're interested in</li>
        <li>Then, choose the site you want to download annotations for</li>
        <li>Finally, click the <i>Download annotations</i> link</li>
      </ol>
    </ng-template>

    <!-- Display error if exists -->
    <ng-container *ngIf="error">
      <baw-error-handler [error]="error"></baw-error-handler>
    </ng-container>

    <!-- Display spinner if loading -->
    <ng-container *ngIf="loadingModel">
      <baw-loading></baw-loading>
    </ng-container>
  `,
  styles: [
    `
      h2 {
        margin: 0;
        padding: 30px 0;
        font-size: 34px;
      }
    `,
  ],
})
class DataRequestComponent
  extends withUnsubscribe(PageComponent)
  implements OnInit {
  public canRequestAnnotations = false;
  public error: ApiErrorDetails;
  public loadingModel = false;
  public user: User;
  public site: Site;
  public region: Region;

  public constructor(
    private accountsApi: AccountsService,
    private regionsApi: ShallowRegionsService,
    private sitesApi: ShallowSitesService,
    private route: ActivatedRoute
  ) {
    super();
  }

  public ngOnInit(): void {
    const { userId, regionId, siteId } = this.route.snapshot.queryParams;
    const hasModel =
      isInstantiated(userId) ||
      isInstantiated(siteId) ||
      isInstantiated(regionId);

    if (!hasModel) {
      return;
    }

    this.canRequestAnnotations = true;
    this.loadingModel = true;

    if (isInstantiated(userId)) {
      this.retrieveUser(userId);
    } else if (isInstantiated(siteId)) {
      this.retrieveSite(siteId);
    } else {
      this.retrieveRegion(regionId);
    }
  }

  private retrieveUser(id: number) {
    this.retrieveModel<User>(
      this.accountsApi,
      id,
      (model) => (this.user = model)
    );
  }

  private retrieveRegion(id: number) {
    this.retrieveModel<Region>(
      this.regionsApi,
      id,
      (model) => (this.region = model)
    );
  }

  private retrieveSite(id: number) {
    this.retrieveModel<Site>(this.sitesApi, id, (model) => (this.site = model));
  }

  private retrieveModel<
    Model extends AbstractModel,
    Service extends ApiShow<Model> = ApiShow<Model>
  >(api: Service, id: number, callback: (model: Model) => void) {
    api
      .show(id)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (model) => {
          this.loadingModel = false;
          callback(model);
        },
        (err: ApiErrorDetails) => {
          this.loadingModel = false;
          this.error = err;
        }
      );
  }
}

DataRequestComponent.linkComponentToPageInfo({
  category: dataRequestCategory,
}).andMenuRoute(dataRequestMenuItem);

export { DataRequestComponent };
