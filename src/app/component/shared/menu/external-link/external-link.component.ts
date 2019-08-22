import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MenuLink } from "src/app/interfaces/menusInterfaces";

@Component({
  selector: "app-menu-external-link",
  template: `
    <a
      class="nav-link"
      href="{{ link.uri }}"
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
  styleUrls: ["./external-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuExternalLinkComponent {
  @Input() id: string;
  @Input() link: MenuLink;
  @Input() placement: "left" | "right";

  constructor() {}
}
