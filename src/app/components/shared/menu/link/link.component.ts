import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Input,
  OnChanges,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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
      [ngbTooltip]="tooltipContent"
      [class.disabled]="link.disabled"
    >
      <ng-container *ngIf="isInternalLink; else external">
        <!-- Internal Link -->
        <a
          class="nav-link ps-3 py-2 rounded"
          strongRouteActive="active"
          [strongRoute]="internalLink.route"
          [strongRouteActiveOptions]="{ exact: true }"
          [class.active]="link.highlight"
          [class.disabled]="link.disabled"
        >
          <ng-container *ngTemplateOutlet="linkDetails"></ng-container>
        </a>
      </ng-container>
      <ng-template #external>
        <!-- External Link -->
        <a
          class="nav-link ps-3 py-2 rounded"
          [href]="href"
          [class.disabled]="link.disabled"
        >
          <ng-container *ngTemplateOutlet="linkDetails"></ng-container>
        </a>
      </ng-template>
    </span>

    <!-- Link Details -->
    <ng-template #linkDetails>
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
    </ng-template>

    <ng-template #tooltipContent>
      <ng-container *ngIf="disabledReason">
        {{ disabledReason }}<br />
      </ng-container>
      {{ tooltip }}
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
  public disabledReason: string;
  public href: string;

  public constructor(
    @Inject(API_ROOT) private apiRoot: string,
    private activatedRoute: ActivatedRoute
  ) {}

  public ngOnChanges(): void {
    if (typeof this.link.disabled === "string") {
      this.disabledReason = this.link.disabled;
    }

    if (!this.isInternalLink) {
      this.handleExternalLink();
    }
  }

  public get isInternalLink(): boolean {
    return isInternalRoute(this.link);
  }

  public get internalLink(): MenuRoute {
    return this.link as MenuRoute;
  }

  public get externalLink(): MenuLink {
    return this.link as MenuLink;
  }

  private handleExternalLink(): void {
    const uri = this.externalLink.uri(this.activatedRoute.snapshot.params);

    /*
     * TODO This is a potential future point of failure if the website and the api
     * do not exist on the same domain
     *
     * Prepend apiRoot to relative links
     */
    this.href = uri.startsWith("/") ? this.apiRoot + uri : uri;
  }
}
