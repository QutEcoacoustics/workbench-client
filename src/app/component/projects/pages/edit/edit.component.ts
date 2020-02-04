import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Id } from "src/app/interfaces/apiInterfaces";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  editProjectMenuItem,
  projectCategory,
  projectMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";
import data from "./edit.json";

@Page({
  category: projectCategory,
  menus: {
    actions: List([projectMenuItem, ...projectMenuItemActions]),
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
  private unsubscribe = new Subject();
  error: string;
  errorDetails: ApiErrorDetails;
  loading: boolean;
  ready: boolean;
  schema = data;
  success: string;

  projectId: Id;

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

    this.route.params
      .pipe(
        flatMap(params => {
          this.projectId = params.projectId;
          return this.api.show(this.projectId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        project => {
          this.schema.model["name"] = project.name;
          this.ready = true;
        },
        (err: ApiErrorDetails) => {
          this.errorDetails = err;
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
    const project = { ...$event, id: this.projectId };

    this.loading = true;
    this.ref.detectChanges();

    this.api
      .update(project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.success = "Project was successfully updated.";
          this.error = null;
          this.loading = false;
        },
        (err: ApiErrorDetails) => {
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
