import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { MenuAction } from "@interfaces/menusInterfaces";
import { MenuModal } from "@menu/widgetItem";
import { Placement } from "@ng-bootstrap/ng-bootstrap";

/**
 * Menu Button Component
 */
@Component({
  selector: "baw-menu-button",
  template: `
    <button
      class="btn ps-3 py-2 rounded text-start"
      (click)="link.action()"
      [disabled]="link.disabled"
      [class.disabled]="link.disabled"
      [ngbTooltip]="tooltipContent"
      [placement]="placement"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
    </button>

    <ng-template #tooltipContent>
      <ng-container *ngIf="disabledReason">
        {{ disabledReason }}<br />
      </ng-container>
      {{ tooltip }}
    </ng-template>
  `,
  styleUrls: ["./button.component.scss"],
  // This will be recreated every time the page loads
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuButtonComponent implements OnInit {
  @Input() public link: MenuAction | MenuModal;
  @Input() public placement: Placement;
  @Input() public tooltip: string;
  public disabledReason: string;

  public ngOnInit() {
    if (typeof this.link.disabled === "string") {
      this.disabledReason = this.link.disabled;
    }
  }
}
