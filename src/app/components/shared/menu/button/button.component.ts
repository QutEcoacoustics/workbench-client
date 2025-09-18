import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input
} from "@angular/core";
import { MenuAction } from "@interfaces/menusInterfaces";
import { MenuModal } from "@menu/widgetItem";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

/**
 * Menu Button Component
 */
@Component({
  selector: "baw-menu-button",
  template: `
    <div
      placement="auto"
      [ngbTooltip]="tooltipContent"
      [class.disabled]="link().disabled"
    >
      <button
        class="btn ps-3 py-2 rounded text-start border-0"
        (click)="link().action()"
        [disabled]="link().disabled"
        [class.disabled]="link().disabled"
      >
        <div class="icon"><fa-icon [icon]="link().icon"></fa-icon></div>
        <span id="label">{{ link().label }}</span>
      </button>
    </div>

    <ng-template #tooltipContent>
      @if (disabledReason) {
        {{ disabledReason }}<br />
      }
      {{ tooltip() }}
    </ng-template>
  `,
  styleUrl: "./button.component.scss",
  // This will be recreated every time the page loads
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbTooltip, FaIconComponent],
})
export class MenuButtonComponent implements OnInit {
  public readonly link = input<MenuAction | MenuModal>(undefined);
  public readonly tooltip = input<string>(undefined);
  public disabledReason: string;

  public ngOnInit() {
    const link = this.link();
    if (typeof link.disabled === "string") {
      this.disabledReason = link.disabled;
    }
  }
}
