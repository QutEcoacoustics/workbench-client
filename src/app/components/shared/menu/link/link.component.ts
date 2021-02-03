import { Location } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
} from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import {
  isInternalRoute,
  MenuLink,
  MenuRoute,
} from "@interfaces/menusInterfaces";
import { Placement } from "@ng-bootstrap/ng-bootstrap";

/**
 * Menu Link Component
 */
@Component({
  selector: "baw-menu-link",
  template: `
    <span
      [placement]="placement"
      [ngbTooltip]="tooltip"
      [class.disabled]="link.disabled"
    >
      <ng-container *ngIf="isInternalLink; else external">
        <!-- Internal Link -->
        <a
          class="nav-link"
          [strongRoute]="internalLink.route"
          [class.active]="active"
          [class.disabled]="link.disabled"
        >
          <ng-container *ngTemplateOutlet="linkDetails"></ng-container>
        </a>
      </ng-container>
      <ng-template #external>
        <!-- External Link -->
        <a class="nav-link" [href]="href" [class.disabled]="link.disabled">
          <ng-container *ngTemplateOutlet="linkDetails"></ng-container>
        </a>
      </ng-template>
    </span>

    <!-- Link Details -->
    <ng-template #linkDetails>
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
    </ng-template>
  `,
  styleUrls: ["./link.component.scss"],
  // This will be recreated every time the page loads
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuLinkComponent implements OnChanges {
  @Input() public link: MenuRoute | MenuLink;
  @Input() public placement: Placement;
  @Input() public tooltip: string;
  public active: boolean;
  public href: string;

  public constructor(
    @Inject(API_ROOT) private apiRoot: string,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  public ngOnChanges() {
    const params = this.activatedRoute.snapshot.params;

    if (this.isInternalLink) {
      this.handleInternalLink(params);
    } else {
      this.handleExternalLink(params);
    }
  }

  public get isInternalLink() {
    return isInternalRoute(this.link);
  }

  public get internalLink(): MenuRoute {
    return this.link as MenuRoute;
  }

  public get externalLink(): MenuLink {
    return this.link as MenuLink;
  }

  private handleInternalLink(params: Params) {
    const currentRoute = this.internalLink.route.toRouterLink(params);

    // Determine if link is active
    this.active =
      this.link.active ||
      this.link.highlight ||
      currentRoute === this.location.path().split("?")[0];
  }

  private handleExternalLink(params: Params) {
    const uri = this.externalLink.uri(params);

    /*
     * TODO This is a potential future point of failure if the website and the api
     * do not exist on the same domain
     *
     * Prepend apiRoot to relative links
     */
    this.href = uri.startsWith("/") ? this.apiRoot + uri : uri;
  }
}
