import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import {
  editProjectMenuItem,
  projectCategory,
} from "@components/projects/projects.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { List } from "immutable";
import { ToastsService } from "@services/toasts/toasts.service";
import { projectMenuItemActions } from "../details/details.component";
import schema from "../../project.schema.json";

const projectKey = "project";

@Component({
  selector: "baw-project-edit",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      [submitLoading]="loading"
      submitLabel="Submit"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class EditComponent extends FormTemplate<Project> implements OnInit {
  public fields = schema.fields;
  public title: string;

  public constructor(
    private api: ProjectsService,
    protected notifications: ToastsService,
    protected route: ActivatedRoute,
    protected router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[projectKey] as Project,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (this.failure) {
      return;
    }

    this.title = `Edit ${this.model.name}`;

    if (!this.model.can("updateAllowAudioUpload").can) {
      this.fields = this.fields.filter(
        (field) => field.key !== "allowAudioUpload"
      );
    }
  }

  protected apiAction(model: Partial<Project>) {
    return this.api.update(new Project(model));
  }
}

EditComponent.linkToRoute({
  category: projectCategory,
  pageRoute: editProjectMenuItem,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { EditComponent };
