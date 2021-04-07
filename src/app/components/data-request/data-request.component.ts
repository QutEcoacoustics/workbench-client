import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";

@Component({
  selector: "baw-data-request",
  template: `
    <h1>Data Request</h1>
    <h2 class="text-center">Annotations Download</h2>

    <ng-container *ngIf="!canRequestAnnotations; else requestAnnotations">
      <p>To download a standard CSV of annotations</p>
      <ol>
        <li>Navigate to the project you're interested in</li>
        <li>Then, choose the site you want to download annotations for</li>
        <li>Finally, click the <i>Download annotations</i> link</li>
      </ol>
    </ng-container>
    <ng-template #requestAnnotations>
      <baw-request-annotations></baw-request-annotations>
    </ng-template>

    <baw-request-custom></baw-request-custom>
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

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const {
      userId,
      projectId,
      regionId,
      siteId,
    } = this.route.snapshot.queryParams;
    this.canRequestAnnotations =
      isInstantiated(userId) ||
      isInstantiated(projectId) ||
      isInstantiated(regionId) ||
      isInstantiated(siteId);
  }
}

DataRequestComponent.linkComponentToPageInfo({
  category: dataRequestCategory,
}).andMenuRoute(dataRequestMenuItem);

export { DataRequestComponent };
