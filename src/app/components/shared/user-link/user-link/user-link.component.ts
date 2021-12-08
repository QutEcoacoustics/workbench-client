import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { User } from "@models/User";
import { Placement } from "@ng-bootstrap/ng-bootstrap";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: "baw-user-link",
  template: `
    <!-- Loading text -->
    <ng-container *ngIf="user | isUnresolved; else resolved">
      <baw-loading size="sm"></baw-loading>
    </ng-container>

    <ng-template #resolved>
      <!-- Show username -->
      <a
        *ngIf="!user.isGhost; else ghostUser"
        [bawUrl]="user.viewUrl"
        [innerText]="user.userName"
      ></a>

      <!-- Show ghost user -->
      <ng-template #ghostUser>
        <span [innerText]="user.userName"></span>

        <fa-icon
          *ngIf="user?.isGhost"
          class="ms-1"
          [icon]="icon"
          [placement]="tooltipPlacement"
          [ngbTooltip]="getHint()"
        ></fa-icon>
      </ng-template>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
