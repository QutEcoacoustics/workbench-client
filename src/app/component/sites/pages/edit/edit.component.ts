import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { flattenFields } from "src/app/component/shared/form/form.component";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Id } from "src/app/interfaces/apiInterfaces";
import { Site } from "src/app/models/Site";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory
} from "../../sites.menus";
import { siteMenuItemActions } from "../details/details.component";
import data from "./edit.json";

@Page({
  category: sitesCategory,
  menus: {
    actions: List([siteMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: editSiteMenuItem
})
@Component({
  selector: "app-sites-edit",
  template: `
    <app-wip>
      <app-form
        *ngIf="ready"
        [schema]="schema"
        [title]="'Edit Site'"
        [error]="error"
        [success]="success"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
    <app-error-handler [error]="errorDetails"></app-error-handler>
  `
})
export class EditComponent extends PageComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  error: string;
  errorDetails: ApiErrorDetails;
  loading: boolean;
  ready: boolean;
  schema = data;
  success: string;

  projectId: Id;
  siteId: Id;

  constructor(
    private route: ActivatedRoute,
    private api: SitesService,
    private ref: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit() {
    this.ready = false;
    this.loading = false;

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
        site => {
          this.schema.model["name"] = site.name;
          this.ready = true;
        },
        (err: ApiErrorDetails) => {
          this.errorDetails = err;
          this.ready = false;
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    console.log($event);

    this.loading = true;
    this.ref.detectChanges();

    const site = new Site({ id: this.siteId, ...flattenFields($event) });

    this.api
      .update(site, this.projectId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.success = "Site was successfully updated.";
          this.error = null;
          this.loading = false;
        },
        (err: ApiErrorDetails) => {
          this.success = null;
          this.error = err.message;
          this.loading = false;
        }
      );
  }
}
