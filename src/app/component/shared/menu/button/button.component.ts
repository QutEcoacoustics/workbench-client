import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MenuAction } from "src/app/interfaces/menusInterfaces";

@Component({
  selector: "app-menu-button",
  template: `
    <button
      class="btn text-left"
      (click)="link.action()"
      ngbTooltip="{{ link.tooltip() }}"
      placement="{{ placement }}"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span>{{ link.label }}</span>
      <span class="d-none" [id]="id">
        {{ link.tooltip }}
      </span>
    </button>
  `,
  styleUrls: ["./button.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuButtonComponent {
  @Input() id: string;
  @Input() link: MenuAction;
  @Input() placement: "left" | "right";

  constructor() {}
}
