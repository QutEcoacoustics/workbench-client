import { Component, OnInit } from "@angular/core";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { WebsiteStatus } from "@models/WebsiteStatus";
import { List } from "immutable";
import { IItem } from "@shared/items/item/item.component";
import { takeUntil } from "rxjs/operators";
import { PageComponent } from "@helpers/page/pageComponent";
import { reportProblemMenuItem } from "@components/report-problem/report-problem.menus";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import {
  websiteStatusCategory,
  websiteStatusMenuItem,
} from "./website-status.menu";

@Component({
  selector: "baw-website-status",
  template: `
    <h2>Website Status</h2>
    <baw-items [items]="statusItems()"></baw-items>

    <p>
      If you are experiencing issues with the website, please
      <a [strongRoute]="reportProblemRoute">Report a Problem</a> so we can
      investigate.
    </p>
  `,
})
class WebsiteStatusComponent extends PageComponent implements OnInit {
  public constructor(private api: WebsiteStatusService) {
    super();
  }

  protected reportProblemRoute = reportProblemMenuItem.route;

  public ngOnInit(): void {
    this.api.status$
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((model) => (this.model = model));
  }

  protected model: WebsiteStatus;

  protected statusItems(): List<IItem> {
    // if we get no response from the server, the model will be "null"
    // if we want to see if the server connection is healthy, we want to negate this.model?.timedOut
    // (so that true) means the server did not time out
    // however, because "null" is a falsey value, negating "null" will return true (representing that the server connection is healthy)
    // if we didn't receive a response from the server, we want to keep "null" so that we can display "Unknown" in the template
    // we therefore need to check if the model is instantiated before we negate it
    const serverTimeout: boolean = isInstantiated(this.model?.timedOut)
      ? !this.model.timedOut
      : null;

    return List<IItem>([
      {
        name: "Overall Server Health",
        icon: ["fas", "heartbeat"],
        ...this.listItemContent(this.model?.isStatusHealthy),
      },
      {
        name: "Server Connection",
        icon: ["fas", "network-wired"],
        ...this.listItemContent(serverTimeout),
      },
      {
        name: "Database",
        icon: ["fas", "database"],
        ...this.listItemContent(this.model?.database),
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
        name: "User Internet Connection",
        icon: ["fas", "wifi"],
        ...this.listItemContent(navigator.onLine),
      },
    ]);
  }

  private listItemContent(healthy?: boolean): Partial<IItem> {
    if (!isInstantiated(healthy)) {
      return {
        value: "Unknown",
        color: "secondary",
      };
    }

    const value = healthy ? "Healthy" : "Unhealthy";
    const color = healthy ? "success" : "danger";

    return { value, color };
  }
}

WebsiteStatusComponent.linkToRoute({
  category: websiteStatusCategory,
  pageRoute: websiteStatusMenuItem,
});

export { WebsiteStatusComponent };
