import { Component, OnInit } from "@angular/core";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem,
} from "@components/projects/projects.menus";
import { withFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { Project } from "@models/Project";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";
import { projectsMenuItemActions } from "../list/list.component";
import { fields } from "./request.schema.json";

@Component({
  selector: "baw-projects-request",
  template: `
    <baw-wip>
      <baw-form
        *ngIf="projects"
        title="Request project access"
        [model]="model"
        [fields]="fields"
        submitLabel="Submit request"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>
      <baw-error-handler *ngIf="error" [error]="error"></baw-error-handler>
    </baw-wip>
  `,
})
class RequestComponent extends withFormCheck(PageComponent) implements OnInit {
  public error: ApiErrorDetails;
  public fields = fields;
  public loading: boolean;
  public model = {};
  public projects: Project[];

  public constructor(private api: ProjectsService) {
    super();
  }

  public ngOnInit() {
    this.loading = false;

    // TODO Change this to the list of projects a user does not have access to
    this.api
      .list()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        (projects) => {
          this.projects = projects;
          this.fields[0].templateOptions.options = projects.map((project) => ({
            value: project.id,
            label: project.name,
          }));
        },
        (err: ApiErrorDetails) => {
          this.error = err;
        }
      );
  }

  /**
   * Form submission
   *
   * @param $event Form response
   */
  public submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}

RequestComponent.linkComponentToPageInfo({
  category: projectsCategory,
  menus: { actions: List([projectsMenuItem, ...projectsMenuItemActions]) },
}).andMenuRoute(requestProjectMenuItem);

export { RequestComponent };
