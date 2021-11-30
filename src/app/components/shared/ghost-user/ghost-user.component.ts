import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { AbstractModel } from "@models/AbstractModel";
import { isDeletedUser, isUnknownUser } from "@models/User";
import { Placement } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-ghost-user",
  template: `
    <span *ngIf="isGhostUser">
      {{ label }}
      <fa-icon
        [icon]="icon"
        [ngbTooltip]="tooltip"
        [placement]="tooltipPlacement"
      ></fa-icon>
    </span>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhostUserComponent implements OnChanges {
  @Input() public user: AbstractModel;
  @Input() public tooltipPlacement: Placement = "auto";
  public label: string;
  // ! Validate tooltips are readable inside ngx-datatable's when changing. The
  // ! tables have wrapping which cuts off text which goes outside of the table
  // ! bounds
  public tooltip: string;
  public icon: IconProp = ["fas", "info-circle"];
  public isGhostUser: boolean;

  public ngOnChanges() {
    this.isGhostUser = true;
    if (isDeletedUser(this.user)) {
      this.label = "Deleted User";
      this.tooltip = "User account has been deleted and is no longer available";
    } else if (isUnknownUser(this.user)) {
      this.label = "Unknown User";
      this.tooltip =
        "It appears you dont have the necessary permissions to access this users details";
    } else {
      this.isGhostUser = false;
    }
  }
}
