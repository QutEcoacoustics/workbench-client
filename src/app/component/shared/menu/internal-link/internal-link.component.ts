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
      [ngbTooltip]="link.tooltip()"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
      <span class="d-none" [id]="id">
        {{ link.tooltip() }}
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
  linkRoute: string;
  active: boolean;

  constructor() {}

  ngOnInit() {
    // Replace attributes in route path (eg. /projects/:projectId => /projects/512)
    this.linkRoute = this.link.route.toString();
    for (const paramKey in this.linkParams) {
      this.linkRoute = this.linkRoute.replace(
        ":" + paramKey,
        this.linkParams[paramKey]
      );
    }

    // Determine if link is active
    this.active = this.linkRoute === window.location.pathname;
  }
}
