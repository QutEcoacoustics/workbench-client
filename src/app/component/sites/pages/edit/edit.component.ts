import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import { flattenFields } from "src/app/component/shared/form/form.component";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { ID } from "src/app/interfaces/apiInterfaces";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { editSiteMenuItem, sitesCategory } from "../../sites.menus";
import data from "./edit.json";

@Page({
  category: sitesCategory,
  menus: {
    actions: List(),
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
  error: string;
  errorDetails: APIErrorDetails;
  loading: boolean;
  ready: boolean;
  schema = data;
  subSink: SubSink = new SubSink();
  success: string;

  projectId: ID;
  siteId: ID;

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

    this.subSink.sink = this.route.params
      .pipe(
        flatMap(params => {
          this.projectId = params.projectId;
          this.siteId = params.siteId;

          return this.api.getProjectSite(this.projectId, this.siteId);
        })
      )
      .subscribe(
        site => {
          this.schema.model["name"] = site.name;
          this.ready = true;
        },
        (err: APIErrorDetails) => {
          this.errorDetails = err;
          this.ready = false;
        }
      );
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    this.ref.detectChanges();

    const input = flattenFields($event);

    this.subSink.sink = this.api
      .updateProjectSite(this.projectId, this.siteId, input)
      .subscribe(
        () => {
          this.success = "Site was successfully updated.";
          this.error = null;
          this.loading = false;
        },
        (err: APIErrorDetails) => {
          this.success = null;
          this.error = err.message;
          this.loading = false;
        }
      );
  }
}
