import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectsService } from "@baw-api/project/projects.service";
import { newProjectMenuItem, projectsCategory } from "@components/projects/projects.menus";
import { defaultSuccessMsg, FormTemplate } from "@helpers/formTemplate/formTemplate";
import { Project } from "@models/Project";
import { List } from "immutable";
import { ToastService } from "@services/toasts/toasts.service";
import { projectsMenuItemActions } from "../list/list.component";
import schema from "../../project.schema.json";

@Component({
  selector: "baw-projects-new",
  template: `
    @if (!failure) {
      <baw-form
        title="New Project"
        [model]="model"
        [fields]="fields"
        submitLabel="Submit"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></baw-form>
    }
  `,
  standalone: false,
})
class NewComponent extends FormTemplate<Project> {
  public fields = schema.fields;

  public constructor(
    private api: ProjectsService,
    notifications: ToastService,
    route: ActivatedRoute,
    router: Router,
  ) {
    super(notifications, route, router, {
      successMsg: (model) => defaultSuccessMsg("created", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });

    // Filter out allowAudioUpload field on new form. We can do this
    // intelligently with https://github.com/QutEcoacoustics/baw-server/issues/561
    this.fields = this.fields.filter((field) => field.key !== "allowAudioUpload");
  }

  protected apiAction(model: Partial<Project>) {
    return this.api.create(new Project(model));
  }
}

NewComponent.linkToRoute({
  category: projectsCategory,
  pageRoute: newProjectMenuItem,
  menus: { actions: List(projectsMenuItemActions) },
});

export { NewComponent };
