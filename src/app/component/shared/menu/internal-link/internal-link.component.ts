import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { Params } from "@angular/router";
import { MenuRoute } from "src/app/interfaces/menusInterfaces";

@Component({
  selector: "app-menu-internal-link",
  template: `
    <a
      class="nav-link"
      [ngClass]="{ active: active }"
      [routerLink]="linkRoute"
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
  @Input() linkParams: Params;
  @Input() placement: "left" | "right";
  @Input() tooltip: string;
  linkRoute: string;
  active: boolean;

  constructor() {}

  ngOnInit() {
    this.linkRoute = this.link.route.format(this.linkParams);
    this.active = this.linkRoute === window.location.pathname;
  }
}
