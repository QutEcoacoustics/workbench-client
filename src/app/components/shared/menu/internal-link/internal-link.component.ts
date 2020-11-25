import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { MenuRoute, menuRoute } from "@interfaces/menusInterfaces";
import { Placement } from "@ng-bootstrap/ng-bootstrap";

/**
 * Internal Menu Link Component
 */
@Component({
  selector: "baw-menu-internal-link",
  template: `
    <span [placement]="placement" [ngbTooltip]="tooltip">
      <a
        class="nav-link"
        [ngClass]="{ active: active, disabled: disabled }"
        [routerLink]="route"
      >
        <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
        <span id="label">{{ link.label }}</span>
        <span class="d-none" [id]="id">{{ tooltip }}</span>
      </a>
    </span>
  `,
  styleUrls: ["./internal-link.component.scss"],
  // This will be recreated every time the page loads
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuInternalLinkComponent implements OnChanges {
  @Input() public id: string;
  @Input() public link: MenuRoute;
  @Input() public route: string;
  @Input() public placement: Placement;
  @Input() public tooltip: string;
  public active: boolean;
  public disabled: boolean;

  public constructor(private location: Location) {}

  public ngOnChanges() {
    this.disabled = this.link.disabled;
    this.active =
      this.route === this.location.path().split("?")[0] || this.disabled;
  }
}
