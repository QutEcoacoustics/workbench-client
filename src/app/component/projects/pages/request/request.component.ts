import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem
} from "../../projects.menus";
import { projectsMenuItemActions } from "../list/list.component";
import { fields } from "./request.json";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, ...projectsMenuItemActions]),
    links: List()
  },
  self: requestProjectMenuItem
})
@Component({
  selector: "app-projects-request",
  template: `
    <app-wip>
      <app-form
        *ngIf="projects"
        [schema]="schema"
        [title]="'Request project access'"
        [submitLabel]="'Submit request'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
      <app-error-handler [error]="error"></app-error-handler>
    </app-wip>
  `
})
export class RequestComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public error: ApiErrorDetails;
  public loading: boolean;
  public projects: Project[];
  public schema = { model: {}, fields };

  constructor(private api: ProjectsService) {
    super();
  }

  ngOnInit() {
    this.loading = false;

    // TODO Change this to the list of projects a user does not have access to
    this.api
      .list()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        projects => {
          this.projects = projects;
          this.schema.fields[0].templateOptions.options = projects.map(
            project => {
              return {
                value: project.id,
                label: project.name
              };
            }
          );
        },
        (err: ApiErrorDetails) => {
          this.error = err;
        }
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
