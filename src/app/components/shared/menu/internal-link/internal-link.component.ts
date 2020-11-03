import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { MenuRoute } from "@interfaces/menusInterfaces";

/**
 * Internal Menu Link Component
 */
@Component({
  selector: "baw-menu-internal-link",
  template: `
    <!--
      No tooltips for disabled links because of:
      https://github.com/ng-bootstrap/ng-bootstrap/issues/1250#issuecomment-274916839
    -->
    <a
      class="nav-link"
      [ngClass]="{ active: active, disabled: disabled }"
      [routerLink]="route"
      [placement]="placement"
      [ngbTooltip]="tooltip"
    >
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
      <span class="d-none" [id]="id">{{ tooltip }}</span>
    </a>
  `,
  styleUrls: ["./internal-link.component.scss"],
  // This will be recreated every time the page loads
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuInternalLinkComponent implements OnChanges {
  @Input() public id: string;
  @Input() public link: MenuRoute;
  @Input() public route: string;
  @Input() public placement: "left" | "right";
  @Input() public tooltip: string;
  public active: boolean;
  public disabled: boolean;

  constructor(private location: Location) {}

  public ngOnChanges() {
    this.disabled = this.link.disabled;
    this.active =
      this.route === this.location.path().split("?")[0] || this.disabled;
  }
}
