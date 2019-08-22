import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MenuRoute } from "src/app/interfaces/menusInterfaces";

@Component({
  selector: "app-menu-internal-link",
  template: `
    <a
      class="nav-link"
      routerLink="{{ link.route }}"
      routerLinkActive="active"
      placement="{{ placement }}"
      ngbTooltip="{{ link.tooltip() }}"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span>{{ link.label }}</span>
      <span class="d-none" [id]="id">
        {{ link.tooltip() }}
      </span>
    </a>
  `,
  styleUrls: ["./internal-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuInternalLinkComponent {
  @Input() id: string;
  @Input() link: MenuRoute;
  @Input() placement: "left" | "right";

  constructor() {}
}
