import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApiErrorDetails } from "@baw-api/api.interceptor.service";
import { ProjectsService } from "@baw-api/project/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
} from "@components/projects/projects.menus";
import {
  defaultSuccessMsg,
  extendedErrorMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Project } from "@models/Project";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import schema from "../../project.schema.json";
import { projectsMenuItemActions } from "../list/list.component";

@Component({
  selector: "baw-projects-new",
  template: `
    <baw-form
      *ngIf="!failure"
      title="New Project"
      [model]="model"
      [fields]="fields"
      submitLabel="Submit"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class NewComponent extends FormTemplate<Project> {
  public fields = schema.fields;

  public constructor(
    private api: ProjectsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      failureMsg: (error) => projectErrorMsg(error),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  protected apiAction(model: Partial<Project>) {
    return this.api.create(new Project(model));
  }
}

NewComponent.linkComponentToPageInfo({
  category: projectsCategory,
  menus: {
    actions: List([projectsMenuItem, ...projectsMenuItemActions]),
  },
}).andMenuRoute(newProjectMenuItem);

export { NewComponent };

/**
 * Handle project form error messages
 *
 * @param err Api error details
 */
export function projectErrorMsg(err: ApiErrorDetails) {
  return extendedErrorMsg(err, { name: (value) => `name ${value[0]}` });
}
