import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { editProjectMenuItem, projectCategory } from "../../projects.menus";
import data from "./edit.json";
import { ID } from "src/app/interfaces/apiInterfaces";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";

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
    <app-error-handler [errorCode]="errorCode"></app-error-handler>
  `
})
export class EditComponent extends PageComponent implements OnInit, OnDestroy {
  error: string;
  errorCode: number;
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
          this.schema.model.name = project.name;
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

    this.subSink.sink = this.api
      .updateProject(this.projectId, $event)
      .subscribe(
        () => {
          this.success = "Project was successfully updated.";
          this.loading = false;
        },
        err => {
          this.error = err;
          this.loading = false;
        }
      );
  }
}
