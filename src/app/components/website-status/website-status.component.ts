import { Component, Inject, OnInit } from "@angular/core";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { WebsiteStatus } from "@models/WebsiteStatus";
import { List } from "immutable";
import { IItem } from "@shared/items/item/item.component";
import { takeUntil } from "rxjs/operators";
import { PageComponent } from "@helpers/page/pageComponent";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { IS_SERVER_PLATFORM } from "src/app/app.helper";
import { ItemsComponent } from "../shared/items/items/items.component";
import { StrongRouteDirective } from "../../directives/strongRoute/strong-route.directive";
import { websiteStatusCategory, websiteStatusMenuItem } from "./website-status.menu";

@Component({
  selector: "baw-website-status",
  template: `
    <h2>Website Status</h2>
    <baw-items [items]="statusItems()"></baw-items>

    <p>
      If you are experiencing issues with the website, please
      <a [strongRoute]="reportProblemRoute">Report a Problem</a> so we can investigate.
    </p>
  `,
  imports: [ItemsComponent, StrongRouteDirective],
})
class WebsiteStatusComponent extends PageComponent implements OnInit {
  public constructor(
    private api: WebsiteStatusService,
    @Inject(IS_SERVER_PLATFORM) public isSsr: boolean,
  ) {
    super();
  }

  protected reportProblemRoute = reportProblemMenuItem.route;

  public ngOnInit(): void {
    this.api.status$.pipe(takeUntil(this.unsubscribe)).subscribe((model) => (this.model = model));
  }

  protected model: WebsiteStatus;
  private healthyListItem = { value: "Healthy", color: "success" } as const;
  private unhealthyListItem = { value: "Unhealthy", color: "danger" } as const;
  private unknownListItem = { value: "Unknown", color: "secondary" } as const;

  protected statusItems(): List<IItem> {
    return List<IItem>([
      {
        name: "Overall Server Health",
        icon: ["fas", "heartbeat"],
        ...this.listItemContent(this.model?.isStatusHealthy),
      },
      {
        name: "Server Connection",
        icon: ["fas", "network-wired"],
        ...this.listItemContent(this.model?.isServerConnectionHealthy),
      },
      {
        name: "Database",
        icon: ["fas", "database"],
        ...this.listItemContent(this.model?.isDatabaseHealthy),
      },
      {
        name: "Cache",
        icon: ["fas", "memory"],
        ...this.listItemContent(this.model?.isRedisHealthy),
      },
      {
        name: "Storage",
        icon: ["fas", "hdd"],
        ...this.listItemContent(this.model?.isStorageHealthy),
      },
      {
        name: "User Uploads",
        icon: ["fas", "cloud"],
        ...this.listItemContent(this.model?.isUploadingHealthy),
      },
      {
        name: "Batch Analysis",
        icon: ["fas", "server"],
        ...this.listItemContent(this.model?.isBatchAnalysisHealthy),
      },
      {
        name: "User Internet Connection",
        icon: ["fas", "wifi"],
        ...this.listItemContent(this.model?.onLine),
      },
    ]);
  }

  // if we don't receive a response from the server, we won't know the status of a service
  // eg. the database. In these cases we want to show "Unknown"
  private listItemContent(healthy: boolean | null): Partial<IItem> {
    if (!isInstantiated(healthy)) {
      return this.unknownListItem;
    }

    return healthy ? this.healthyListItem : this.unhealthyListItem;
  }
}

WebsiteStatusComponent.linkToRoute({
  category: websiteStatusCategory,
  pageRoute: websiteStatusMenuItem,
});

export { WebsiteStatusComponent };
