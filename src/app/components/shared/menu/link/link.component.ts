import { Component, Inject, Input, OnChanges, OnInit } from "@angular/core";
import { IsActiveMatchOptions, Params } from "@angular/router";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import {
  isInternalRoute,
  MenuLink,
  MenuRoute,
} from "@interfaces/menusInterfaces";
import { API_ROOT } from "@services/config/config.tokens";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { Observable } from "rxjs";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { NgTemplateOutlet, AsyncPipe } from "@angular/common";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { StrongRouteActiveDirective } from "../../../../directives/strongRoute/strong-route-active.directive";
import { StrongRouteDirective } from "../../../../directives/strongRoute/strong-route.directive";

/**
 * Menu Link Component
 */
@Component({
    selector: "baw-menu-link",
    template: `
    <div
      placement="auto"
      [ngbTooltip]="tooltipContent"
      [class.disabled]="link.disabled"
    >
      @if (isInternalLink) {
        <!-- Internal Link -->
        <a
          class="nav-link ps-3 py-2 rounded"
          strongRouteActive="active"
          [strongRoute]="internalLink.route"
          [strongRouteActiveOptions]="activeOptions"
          [queryParams]="queryParams | async"
          [routeParams]="routeParams | async"
          [class.active]="link.highlight"
          [class.disabled]="link.disabled"
          [class.primary]="link.primaryBackground"
        >
          <ng-container *ngTemplateOutlet="linkDetails"></ng-container>
        </a>
      } @else {
        <!-- External Link -->
        <a
          class="nav-link ps-3 py-2 rounded"
          [href]="href(routeParams | async)"
          [class.disabled]="link.disabled"
          [class.primary]="link.primaryBackground"
        >
          <ng-container *ngTemplateOutlet="linkDetails"></ng-container>
        </a>
      }
    </div>

    <!-- Link Details -->
    <ng-template #linkDetails>
      <div class="icon"><fa-icon [icon]="link.icon"></fa-icon></div>
      <span id="label">{{ link.label }}</span>
    </ng-template>

    <ng-template #tooltipContent>
      @if (disabledReason) {
        {{ disabledReason }}<br />
      }
      {{ tooltip }}
    </ng-template>
  `,
    styleUrls: ["./link.component.scss"],
    imports: [NgbTooltip, StrongRouteActiveDirective, StrongRouteDirective, NgTemplateOutlet, FaIconComponent, AsyncPipe]
})
export class MenuLinkComponent
  extends withUnsubscribe()
  implements OnInit, OnChanges
{
  @Input() public link: MenuRoute | MenuLink;
  @Input() public tooltip: string;

  public queryParams: Observable<Params>;
  public routeParams: Observable<Params>;
  public disabledReason: string;
  public activeOptions: { exact: true } & IsActiveMatchOptions = {
    exact: true,
    matrixParams: "ignored",
    queryParams: "ignored",
    paths: "exact",
    fragment: "ignored",
  };

  public constructor(
    @Inject(API_ROOT) private apiRoot: string,
    public sharedRoute: SharedActivatedRouteService
  ) {
    super();
  }

  public ngOnInit(): void {
    /*
     * Components outside of router-outlet are unable to read the query/route
     * params of the page component. So we use this bypass, check the service
     * for more details
     */
    this.queryParams = this.sharedRoute.queryParams;
    this.routeParams = this.sharedRoute.params;
  }

  public ngOnChanges(): void {
    if (typeof this.link.disabled === "string") {
      this.disabledReason = this.link.disabled;
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

  public href(routeParams: Params): string {
    const uri = this.externalLink.uri(routeParams);
    // Redirect relative routes to api
    // ! This seems unintuitive and likely needs to be changed in the future #1712
    return uri.startsWith("/") ? this.apiRoot + uri : uri;
  }
}
