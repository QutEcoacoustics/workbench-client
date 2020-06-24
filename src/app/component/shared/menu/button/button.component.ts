import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MenuAction } from "src/app/interfaces/menusInterfaces";

/**
 * Menu Button Component
 */
@Component({
  selector: "baw-menu-button",
  template: `
    <button
      class="btn text-left"
      (click)="link.action()"
      [ngbTooltip]="tooltip"
      [placement]="placement"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
      <span class="d-none" [id]="id">
        {{ tooltip }}
      </span>
    </button>
  `,
  styleUrls: ["./button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuButtonComponent {
  @Input() id: string;
  @Input() link: MenuAction;
  @Input() placement: "left" | "right";
  @Input() tooltip: string;
}
