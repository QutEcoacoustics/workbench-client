import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { projectMenuItem } from "src/app/component/projects/projects.menus";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import {
  deleteSiteMenuItem,
  siteMenuItem,
  sitesCategory
} from "src/app/component/sites/sites.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { siteMenuItemActions } from "../details/details.component";
@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: deleteSiteMenuItem
})
@Component({
  selector: "app-projects-delete",
  template: `
    <app-form
      *ngIf="ready"
      [schema]="{ model: {}, fields: [] }"
      [title]="'Are you certain you wish to delete ' + siteName + '?'"
      [btnColor]="'btn-danger'"
      [error]="error"
      [submitLabel]="'Delete'"
      [submitLoading]="formLoading"
      (onSubmit)="submit($event)"
    ></app-form>
    <app-loading [isLoading]="loading"></app-loading>
    <app-error-handler [error]="errorDetails"></app-error-handler>
  `
})
export class DeleteComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject<any>();
  error: string;
  errorDetails: ApiErrorDetails;
  formLoading: boolean;
  loading: boolean;
  siteName: string;
  ready: boolean;
  projectId: Id;
  siteId: Id;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: SitesService
  ) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.ready = false;

    this.route.params
      .pipe(
        flatMap(params => {
          this.projectId = params.projectId;
          this.siteId = params.siteId;
          return this.api.show(this.projectId, this.siteId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (site: Site) => {
          this.siteName = site.name;
          this.ready = true;
          this.loading = false;
        },
        (err: ApiErrorDetails) => {
          this.errorDetails = err;
          this.loading = false;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next(null);
    this.unsubscribe.complete();
  }

  submit() {
    // This subscription must complete so takeuntil is ignored
    // so that it will run in the background in case the user
    // manages to navigate too fast
    this.formLoading = true;
    this.api
      .destroy(this.projectId, this.siteId)
      // tslint:disable-next-line: rxjs-prefer-angular-takeuntil
      .subscribe(
        () => {
          this.formLoading = false;
          // TODO Get redirect path from Project.redirectPath()
          this.router.navigate([
            projectMenuItem.route.format({ projectId: this.projectId })
          ]);
        },
        (err: ApiErrorDetails) => {
          this.formLoading = false;
          this.error = err.message;
        }
      );
  }
}
