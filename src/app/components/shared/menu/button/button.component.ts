import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { MenuAction } from "@interfaces/menusInterfaces";
import { MenuModal } from "@menu/widgetItem";

/**
 * Menu Button Component
 */
@Component({
  selector: "baw-menu-button",
  template: `
    <div
      placement="auto"
      [ngbTooltip]="tooltipContent"
      [class.disabled]="link.disabled"
    >
      <button
        class="btn ps-3 py-2 rounded text-start border-0"
        (click)="link.action()"
        [disabled]="link.disabled"
        [class.disabled]="link.disabled"
      >
        <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
        <span id="label">{{ link.label }}</span>
      </button>
    </div>

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
  @Input() public tooltip: string;
  public disabledReason: string;

  public ngOnInit() {
    if (typeof this.link.disabled === "string") {
      this.disabledReason = this.link.disabled;
    }
  }
}
