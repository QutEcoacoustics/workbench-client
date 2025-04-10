import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { User } from "@models/User";
import { Placement, NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { LoadingComponent } from "../../loading/loading.component";
import { UrlDirective } from "../../../../directives/url/url.directive";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";

@Component({
    selector: "baw-user-link",
    template: `
    <!-- Loading text -->
    @if (user | isUnresolved) {
      <baw-loading size="sm"></baw-loading>
    } @else {
      <!-- Show username -->
      @if (!user.isGhost) {
        <a [bawUrl]="user.viewUrl" [innerText]="user.userName"></a>
      } @else {
        <span [innerText]="user.userName"></span>
        @if (user?.isGhost) {
          <fa-icon
            class="ms-1"
            [icon]="icon"
            [placement]="tooltipPlacement"
            [ngbTooltip]="getHint()"
          ></fa-icon>
        }
      }
      <!-- Show ghost user -->
    }
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LoadingComponent, UrlDirective, FaIconComponent, NgbTooltip, IsUnresolvedPipe]
})
export class UserLinkComponent {
  // TODO Potentially add the ability for different styles, ie. link/badge/card
  @Input() public user: User;
  @Input() public tooltipPlacement: Placement = "left";
  public icon: IconProp = ["fas", "info-circle"];

  public getHint() {
    return this.user.isUnknown
      ? "You may not have access to this information, try logging in"
      : "This user appears to have deleted their account";
  }
}
