import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { editProjectMenuItem, projectCategory } from "../../projects.menus";
import data from "./edit.json";
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
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class EditComponent extends PageComponent implements OnInit {
  schema = data;
  error: string;
  loading: boolean;
  ready: boolean;

  constructor(private route: ActivatedRoute, private api: ProjectsService) {
    super();
  }

  ngOnInit() {
    this.ready = false;
    this.loading = false;

    this.route.params
      .pipe(
        flatMap(params => {
          return this.api.getProject(params.projectId);
        })
      )
      .subscribe(
        project => {
          this.schema.model.name = project.name;
          this.ready = true;
        },
        (err: APIErrorDetails) => {}
      );
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}
