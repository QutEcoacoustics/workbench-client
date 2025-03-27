import { Component, OnInit } from "@angular/core";
import { Params } from "@angular/router";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { BreadcrumbsData, MenuService } from "@services/menu/menu.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { map, Observable } from "rxjs";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { AsyncPipe } from "@angular/common";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";

/**
 * Menu Link Component
 */
@Component({
  selector: "baw-breadcrumbs",
  template: `
    @if ({
      breadcrumbs: breadcrumbs$ | async,
      queryParams: queryParams$ | async,
      routeParams: routeParams$ | async
    }; as data) {
      @if (shouldShowBreadcrumbs(data)) {
        <nav
          aria-label="breadcrumb"
          class="text-bg-light"
        >
          <ol class="breadcrumb p-1">
            @for (breadcrumb of data.breadcrumbs; track breadcrumb) {
              <li class="breadcrumb-item">
                <fa-icon class="pe-1" [icon]="breadcrumb.icon"></fa-icon>
                <a
                  [strongRoute]="breadcrumb.route"
                  [routeParams]="data.routeParams"
                  [queryParams]="data.queryParams"
                >
                  {{ breadcrumb.label }}
                </a>
              </li>
            }
          </ol>
        </nav>
      }
    }
  `,
  styleUrl: "breadcrumb.component.scss",
  imports: [
    FaIconComponent,
    StrongRouteDirective,
    AsyncPipe,
  ],
})
export class BreadcrumbComponent implements OnInit {
  public queryParams$: Observable<Params>;
  public routeParams$: Observable<Params>;
  public breadcrumbs$: Observable<BreadcrumbsData>;

  public constructor(
    private sharedRoute: SharedActivatedRouteService,
    private menu: MenuService
  ) {}

  public ngOnInit(): void {
    this.breadcrumbs$ = this.menu.menuUpdate.pipe(
      map(({ breadcrumbs }) => breadcrumbs)
    );

    /*
     * Components outside of router-outlet are unable to read the query/route
     * params of the page component. So we use this bypass, check the service
     * for more details
     */
    this.queryParams$ = this.sharedRoute.queryParams;
    this.routeParams$ = this.sharedRoute.params;
  }

  public shouldShowBreadcrumbs(data: {
    breadcrumbs: BreadcrumbsData;
    queryParams: Params;
    routeParams: Params;
  }): boolean {
    return (
      isInstantiated(data.breadcrumbs) &&
      isInstantiated(data.queryParams) &&
      isInstantiated(data.routeParams) &&
      data.breadcrumbs.size > 0
    );
  }
}
