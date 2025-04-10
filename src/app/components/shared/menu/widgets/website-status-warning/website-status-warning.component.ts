import { Component } from "@angular/core";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import { KeysOfType } from "@helpers/advancedTypes";
import { WebsiteStatus } from "@models/WebsiteStatus";

@Component({
  selector: "baw-website-status-warning",
  template: `
    @if (!(api.status$ | async)?.[feature]) {
      <section>
        <div class="alert alert-danger">
          <div>
            @if (message) {
              <p>{{ message }}</p>
            } @else {
              <ng-content></ng-content>
            }
          </div>

          <div>
            <small>
              <a [strongRoute]="websiteStatusRoute">More Information</a>
            </small>
          </div>
        </div>
      </section>
    }
  `,
  standalone: false
})
export class WebsiteStatusWarningComponent {
  public constructor(protected api: WebsiteStatusService) {}

  public feature: KeysOfType<WebsiteStatus, boolean> = "isStatusHealthy";
  public message?: string;
  protected websiteStatusRoute = websiteStatusMenuItem.route;
}
