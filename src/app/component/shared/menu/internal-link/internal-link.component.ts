import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { MenuRoute } from "src/app/interfaces/menusInterfaces";

/**
 * Internal Menu Link Component
 */
@Component({
  selector: "app-menu-internal-link",
  template: `
    <a
      class="nav-link"
      [ngClass]="{ active: active }"
      [routerLink]="route"
      [placement]="placement"
      [ngbTooltip]="tooltip"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
      <span class="d-none" [id]="id">
        {{ tooltip }}
      </span>
    </a>
  `,
  styleUrls: ["./internal-link.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuInternalLinkComponent implements OnInit {
  @Input() id: string;
  @Input() link: MenuRoute;
  @Input() route: string;
  @Input() placement: "left" | "right";
  @Input() tooltip: string;
  active: boolean;

  constructor() {}

  ngOnInit() {
    this.active = this.route === window.location.pathname;
  }
}
