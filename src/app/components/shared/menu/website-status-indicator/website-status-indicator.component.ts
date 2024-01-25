import { Component } from "@angular/core";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import { StrongRoute } from "@interfaces/strongRoute";
import { ConfigService } from "@services/config/config.service";

@Component({
  selector: "baw-website-status-indicator",
  template: `
    <a
      *ngIf="!(api.status$ | async)?.isStatusHealthy"
      class="block nav-link text-danger text-nowrap"
      [strongRoute]="websiteStatusRoute"
      [ngbTooltip]="
        config.settings.brand.long +
        ' is experiencing a temporary loss of services. ' +
        'Some parts of the website may not work.'
      "
    >
      <fa-icon [icon]="['fas', 'triangle-exclamation']"></fa-icon>
    </a>
  `,
})
export class WebsiteStatusIndicatorComponent {
  public constructor(
    protected config: ConfigService,
    protected api: WebsiteStatusService
  ) {}

  protected websiteStatusRoute: StrongRoute = websiteStatusMenuItem.route;
}
