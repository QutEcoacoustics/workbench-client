import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import {
  newProjectMenuItem,
  projectsMenuItem,
  requestProjectMenuItem
} from "src/app/component/projects/projects.menus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { ID } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import { newSiteMenuItem, sitesCategory } from "../../sites.menus";
import data from "./new.json";

@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([
      projectsMenuItem,
      newProjectMenuItem,
      requestProjectMenuItem
    ]),
    links: List()
  },
  self: newSiteMenuItem
})
@Component({
  selector: "app-sites-new",
  template: `
    <app-form
      *ngIf="ready"
      [schema]="schema"
      [title]="'New Site'"
      [error]="error"
      [success]="success"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
    <app-error-handler [errorCode]="errorCode"></app-error-handler>
  `
})
export class NewComponent extends PageComponent implements OnInit, OnDestroy {
  error: string;
  errorCode: number;
  loading: boolean;
  ready: boolean;
  schema = data;
  subSink: SubSink = new SubSink();
  success: string;

  projectId: ID;

  constructor(
    private sitesApi: SitesService,
    private projectsApi: ProjectsService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.loading = false;

    this.subSink.sink = this.route.params
      .pipe(
        flatMap(params => {
          this.projectId = params.projectId;
          return this.projectsApi.getProject(params.projectId);
        })
      )
      .subscribe(
        () => {
          this.ready = true;
        },
        (err: APIErrorDetails) => {
          this.errorCode = err.status;
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

    this.subSink.sink = this.route.params
      .pipe(
        flatMap(params => {
          return this.sitesApi.newProjectSite(params.projectId, $event);
        })
      )
      .subscribe(
        () => {
          this.success = "Site was successfully created.";
          this.loading = false;
        },
        (err: APIErrorDetails) => {
          this.error = err.message;
          this.loading = false;
        }
      );
  }
}
