import { Component } from "@angular/core";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import { KeysOfType } from "@helpers/advancedTypes";
import { WebsiteStatus } from "@models/WebsiteStatus";

@Component({
  selector: "baw-website-status-warning",
  template: `
    <ng-container *ngIf="!(api.status$ | async)?.[feature]">
      <section>
        <div class="alert alert-danger">
          <div>
            <ng-container *ngIf="message; else contentOutlet">
              <p>{{ message }}</p>
            </ng-container>

            <ng-template #contentOutlet>
              <ng-content></ng-content>
            </ng-template>
          </div>

          <div>
            <small>
              <a [strongRoute]="websiteStatusRoute">More Information</a>
            </small>
          </div>
        </div>
      </section>
    </ng-container>
  `,
})
export class WebsiteStatusWarningComponent {
  public constructor(protected api: WebsiteStatusService) {}

  public feature: KeysOfType<WebsiteStatus, boolean> = "isStatusHealthy";
  public message?: string;
  protected websiteStatusRoute = websiteStatusMenuItem.route;
}
