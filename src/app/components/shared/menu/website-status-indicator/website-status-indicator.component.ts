import { Component, OnInit } from "@angular/core";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { StrongRoute } from "@interfaces/strongRoute";
import { SsrContext } from "@models/WebsiteStatus";
import { ConfigService } from "@services/config/config.service";
import { takeUntil } from "rxjs";

@Component({
  selector: "baw-website-status-indicator",
  template: `
    <a
      *ngIf="shouldShowIcon"
      class="block nav-link text-danger text-nowrap"
      [strongRoute]="websiteStatusRoute"
      [ngbTooltip]="
        config.settings.brand.long +
        ' is experiencing a temporary loss of services. ' +
        'Some parts of the website may not work.'
      "
    >
      <fa-icon
        class="website-status-warning"
        [icon]="['fas', 'triangle-exclamation']"
      ></fa-icon>
    </a>
  `,
})
export class WebsiteStatusIndicatorComponent
  extends withUnsubscribe()
  implements OnInit
{
  public constructor(
    protected config: ConfigService,
    protected api: WebsiteStatusService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.api.status$.pipe(takeUntil(this.unsubscribe)).subscribe((model) => {
      this.shouldShowIcon =
        model instanceof SsrContext ? false : !model.isStatusHealthy;
    });
  }

  protected shouldShowIcon = false;
  protected websiteStatusRoute: StrongRoute = websiteStatusMenuItem.route;
}
