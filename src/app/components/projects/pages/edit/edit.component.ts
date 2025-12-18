import { Component, OnInit, inject } from "@angular/core";
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
import { ToastService } from "@services/toasts/toasts.service";
import { FormComponent } from "@shared/form/form.component";
import { projectMenuItemActions } from "../details/details.component";
import schema from "../../project.schema.json";

const projectKey = "project";

@Component({
  selector: "baw-project-edit",
  template: `
    @if (!failure) {
      <baw-form
        [title]="title"
        [model]="model"
        [fields]="fields"
        [submitLoading]="loading"
        submitLabel="Submit"
        (onSubmit)="submit($event)"
      ></baw-form>
    }
  `,
  imports: [FormComponent]
})
class ProjectEditComponent extends FormTemplate<Project> implements OnInit {
  private readonly api = inject(ProjectsService);
  protected readonly notifications: ToastService;
  protected readonly route: ActivatedRoute;
  protected readonly router: Router;

  public fields = schema.fields;
  public title: string;

  public constructor() {
    const notifications = inject(ToastService);
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    super(notifications, route, router, {
      getModel: (models) => models[projectKey] as Project,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  
    this.notifications = notifications;
    this.route = route;
    this.router = router;
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

ProjectEditComponent.linkToRoute({
  category: projectCategory,
  pageRoute: editProjectMenuItem,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { ProjectEditComponent };
