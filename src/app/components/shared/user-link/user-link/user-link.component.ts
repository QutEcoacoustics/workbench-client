import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { User } from "@models/User";
import { Placement } from "@ng-bootstrap/ng-bootstrap";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

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
  standalone: false
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
