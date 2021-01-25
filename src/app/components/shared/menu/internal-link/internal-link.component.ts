import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuRoute } from "@interfaces/menusInterfaces";
import { Placement } from "@ng-bootstrap/ng-bootstrap";

/**
 * Internal Menu Link Component
 */
@Component({
  selector: "baw-menu-internal-link",
  template: `
    <span
      [placement]="placement"
      [ngbTooltip]="tooltip"
      [class.disabled]="link.disabled"
    >
      <a
        class="nav-link"
        [strongRoute]="link.route"
        [class.active]="active"
        [class.disabled]="link.disabled"
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
  @Input() public placement: Placement;
  @Input() public tooltip: string;
  public active: boolean;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  public ngOnChanges() {
    const routeParams = this.activatedRoute.snapshot.params;
    const currentRoute = this.link.route.toRouterLink(routeParams);

    this.active =
      this.link.active ||
      this.link.highlight ||
      currentRoute === this.location.path().split("?")[0];
  }
}
