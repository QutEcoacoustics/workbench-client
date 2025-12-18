import { Component, OnInit, inject } from "@angular/core";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  projectsCategory,
  requestProjectMenuItem,
} from "@components/projects/projects.menus";
import { withFormCheck } from "@guards/form/form.guard";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { PageComponent } from "@helpers/page/pageComponent";
import { Project } from "@models/Project";
import { List } from "immutable";
import { takeUntil } from "rxjs/operators";
import { WIPComponent } from "@shared/wip/wip.component";
import { FormComponent } from "@shared/form/form.component";
import { ErrorHandlerComponent } from "@shared/error-handler/error-handler.component";
import { projectsMenuItemActions } from "../list/list.component";
import schema from "./request.schema.json";

@Component({
  selector: "baw-projects-request",
  template: `
    <baw-wip>
      @if (projects) {
        <baw-form
          title="Request project access"
          [model]="model"
          [fields]="fields"
          submitLabel="Submit request"
          [submitLoading]="loading"
          (onSubmit)="submit($event)"
        ></baw-form>
      }

      @if (error) {
        <baw-error-handler [error]="error"></baw-error-handler>
      }
    </baw-wip>
  `,
  imports: [WIPComponent, FormComponent, ErrorHandlerComponent],
})
class RequestComponent extends withFormCheck(PageComponent) implements OnInit {
  private readonly api = inject(ProjectsService);

  public error: BawApiError;
  public fields = schema.fields;
  public loading: boolean;
  public model = {};
  public projects: Project[];

  public ngOnInit() {
    this.loading = false;

    // TODO Change this to the list of projects a user does not have access to
    this.api
      .list()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: (projects) => {
          this.projects = projects;
          this.fields[0].props.options = projects.map((project) => ({
            value: project.id,
            label: project.name,
          }));
        },
        error: (err: BawApiError) => {
          this.error = err;
        },
      });
  }

  /**
   * Form submission
   *
   * @param $event Form response
   */
  public submit($event: any) {
    this.loading = true;
    // eslint-disable-next-line no-console
    console.log($event);
    this.loading = false;
  }
}

RequestComponent.linkToRoute({
  category: projectsCategory,
  pageRoute: requestProjectMenuItem,
  menus: { actions: List(projectsMenuItemActions) },
});

export { RequestComponent };
