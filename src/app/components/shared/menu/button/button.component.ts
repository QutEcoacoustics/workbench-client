import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { menuAction } from "@interfaces/menusInterfaces";
import { Placement } from "@ng-bootstrap/ng-bootstrap";

/**
 * Menu Button Component
 */
@Component({
  selector: "baw-menu-button",
  template: `
    <button
      class="btn text-left"
      (click)="link.action()"
      [disabled]="link.disabled"
      [ngbTooltip]="tooltip"
      [placement]="placement"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
      <span class="d-none" [id]="id">{{ tooltip }}</span>
    </button>
  `,
  styleUrls: ["./button.component.scss"],
  // This will be recreated every time the page loads
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuButtonComponent {
  @Input() public id: string;
  @Input() public link: MenuAction;
  @Input() public placement: Placement;
  @Input() public tooltip: string;
}
