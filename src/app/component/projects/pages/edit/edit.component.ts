import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { ID } from "src/app/interfaces/apiInterfaces";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { editProjectMenuItem, projectCategory } from "../../projects.menus";
import data from "./edit.json";

@Page({
  category: projectCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: editProjectMenuItem
})
@Component({
  selector: "app-projects-edit",
  template: `
    <app-wip>
      <app-form
        *ngIf="ready"
        [schema]="schema"
        [title]="'Edit Project'"
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

  constructor(
    private route: ActivatedRoute,
    private api: ProjectsService,
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
          return this.api.getProject(this.projectId);
        })
      )
      .subscribe(
        project => {
          this.schema.model["name"] = project.name;
          this.ready = true;
        },
        (err: APIErrorDetails) => {
          this.errorDetails = err;
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
    console.log($event);

    this.loading = true;
    this.ref.detectChanges();

    this.subSink.sink = this.api
      .updateProject(this.projectId, $event)
      .subscribe(
        () => {
          this.success = "Project was successfully updated.";
          this.error = null;
          this.loading = false;
        },
        (err: APIErrorDetails) => {
          if (err.info && err.info.name && err.info.name.length === 1) {
            this.error = err.message + ": name " + err.info.name[0];
          } else {
            this.error = err.message;
          }
          this.success = null;
          this.loading = false;
        }
      );
  }
}
