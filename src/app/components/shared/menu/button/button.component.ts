import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MenuAction } from "@interfaces/menusInterfaces";

/**
 * Menu Button Component
 */
@Component({
  selector: "baw-menu-button",
  template: `
    <!--
      No tooltips for disabled buttons because of:
      https://github.com/ng-bootstrap/ng-bootstrap/issues/1250#issuecomment-274916839
    -->
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
  @Input() public placement: "left" | "right";
  @Input() public tooltip: string;
}
