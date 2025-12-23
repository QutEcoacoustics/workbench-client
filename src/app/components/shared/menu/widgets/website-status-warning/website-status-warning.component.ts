import { Component, inject } from "@angular/core";
import { WebsiteStatusService } from "@baw-api/website-status/website-status.service";
import { websiteStatusMenuItem } from "@components/website-status/website-status.menu";
import { KeysOfType } from "@helpers/advancedTypes";
import { WebsiteStatus } from "@models/WebsiteStatus";
import { AsyncPipe } from "@angular/common";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";

@Component({
  selector: "baw-website-status-warning",
  template: `
    @if ((api.status$ | async)?.[feature] === false) {
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
  imports: [StrongRouteDirective, AsyncPipe],
})
export class WebsiteStatusWarningComponent {
  protected readonly api = inject(WebsiteStatusService);

  public feature: KeysOfType<WebsiteStatus, boolean> = "isStatusHealthy";
  public message?: string;
  protected websiteStatusRoute = websiteStatusMenuItem.route;
}
