import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { MenuRoute } from "src/app/interfaces/menusInterfaces";

/**
 * Internal Menu Link Component
 */
@Component({
  selector: "baw-menu-internal-link",
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
  // This will be recreated every time the page loads
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuInternalLinkComponent implements OnInit {
  @Input() public id: string;
  @Input() public link: MenuRoute;
  @Input() public route: string;
  @Input() public placement: "left" | "right";
  @Input() public tooltip: string;
  public active: boolean;

  constructor(private location: Location) {}

  public ngOnInit() {
    this.active = this.route === this.location.path();
  }
}
