import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { StrongRoute } from "@interfaces/strongRoute";
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
        [strongRoute]="this.route"
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
  @Input() public route: StrongRoute;
  @Input() public placement: Placement;
  @Input() public tooltip: string;
  public active: boolean;
  public disabled: boolean;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  public ngOnChanges() {
    const routeParams = this.activatedRoute.snapshot.params;
    const currentRoute = this.route.toRouterLink(routeParams);

    this.disabled = this.link.disabled;
    this.active =
      currentRoute === this.location.path().split("?")[0] || this.disabled;
  }
}
