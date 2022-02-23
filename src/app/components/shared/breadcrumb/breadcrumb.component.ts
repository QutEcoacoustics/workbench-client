import { Component, OnInit } from "@angular/core";
import { Params } from "@angular/router";
import { homeMenuItem } from "@components/home/home.menus";
import { BreadcrumbsData, MenuService } from "@services/menu/menu.service";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { map, Observable } from "rxjs";

/**
 * Menu Link Component
 */
@Component({
  selector: "baw-breadcrumbs",
  template: `
    <ng-container *ngIf="breadcrumbs$ | async as breadcrumbs">
      <nav *ngIf="shouldShowBreadcrumbs(breadcrumbs)" aria-label="breadcrumb">
        <ol class="breadcrumb bg-light p-1">
          <li *ngFor="let breadcrumb of breadcrumbs" class="breadcrumb-item">
            <fa-icon class="pe-1" [icon]="breadcrumb.icon"></fa-icon>
            <a
              [strongRoute]="breadcrumb.route"
              [routeParams]="routeParams | async"
              [queryParams]="queryParams | async"
            >
              {{ breadcrumb.label }}
            </a>
          </li>
        </ol>
      </nav>
    </ng-container>
  `,
  styleUrls: ["breadcrumb.component.scss"],
})
export class BreadcrumbComponent implements OnInit {
  public queryParams: Observable<Params>;
  public routeParams: Observable<Params>;
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
    this.queryParams = this.sharedRoute.queryParams;
    this.routeParams = this.sharedRoute.params;
  }

  public shouldShowBreadcrumbs(breadcrumbs: BreadcrumbsData): boolean {
    // Dont show the breadcrumbs on the home page
    return !breadcrumbs.includes(homeMenuItem);
  }
}
