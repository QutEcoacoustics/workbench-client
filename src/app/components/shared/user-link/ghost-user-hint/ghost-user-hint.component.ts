import { Component, Input } from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { User } from "@models/User";
import { Placement } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-ghost-user-hint",
  template: `
    <fa-icon
      *ngIf="user?.isGhost"
      class="ms-1"
      [icon]="icon"
      [placement]="tooltipPlacement"
      [ngbTooltip]="getHint()"
    ></fa-icon>
  `,
})
export class GhostUserHintComponent {
  @Input() public user?: User;
  @Input() public tooltipPlacement: Placement = "left";
  @Input() public icon: IconProp = ["fas", "info-circle"];

  public getHint() {
    return this.user.isUnknown
      ? "You may not have access to this information, try logging in"
      : "This user appears to have deleted their account";
  }
}
