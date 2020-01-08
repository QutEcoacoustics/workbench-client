import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { projectMenuItem } from "src/app/component/projects/projects.menus";
import {
  deleteSiteMenuItem,
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory
} from "src/app/component/sites/sites.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ID } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Site } from "src/app/models/Site";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { SitesService } from "src/app/services/baw-api/sites.service";

@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([
      siteMenuItem,
      editSiteMenuItem,
      deleteSiteMenuItem
    ]),
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
  errorDetails: APIErrorDetails;
  formLoading: boolean;
  loading: boolean;
  siteName: string;
  ready: boolean;
  projectId: ID;
  siteId: ID;

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
          return this.api.getProjectSite(this.projectId, this.siteId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        (site: Site) => {
          this.siteName = site.name;
          this.ready = true;
          this.loading = false;
        },
        (err: APIErrorDetails) => {
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
      .deleteSite(this.projectId, this.siteId)
      // tslint:disable-next-line: rxjs-prefer-angular-takeuntil
      .subscribe(
        () => {
          this.formLoading = false;
          this.router.navigate([
            projectMenuItem.route.format({ projectId: this.projectId })
          ]);
        },
        (err: APIErrorDetails) => {
          this.formLoading = false;
          this.error = err.message;
        }
      );
  }
}
