import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import {
  editProjectMenuItem,
  projectCategory,
  projectMenuItem,
} from "@components/projects/projects.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { Project } from "@models/Project";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import schema from "../../project.schema.json";
import { projectMenuItemActions } from "../details/details.component";
import { projectErrorMsg } from "../new/new.component";

const projectKey = "project";

@Component({
  selector: "baw-project-edit",
  template: `
    <!-- Move ngIf to baw-form when baw-wip removed -->
    <baw-wip *ngIf="!failure">
      <baw-form
        [title]="title"
        [model]="model"
        [fields]="fields"
        [submitLoading]="loading"
        submitLabel="Submit"
        (onSubmit)="submit($event)"
      ></baw-form>
    </baw-wip>
  `,
})
class EditComponent extends FormTemplate<Project> implements OnInit {
  public fields = schema.fields;
  public title: string;

  public constructor(
    private api: ProjectsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[projectKey] as Project,
      successMsg: (model) => defaultSuccessMsg("updated", model.name),
      failureMsg: (error) => projectErrorMsg(error),
      redirectUser: (model) => this.router.navigateByUrl(model.viewUrl),
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Edit ${this.model.name}`;
    }
  }

  protected apiAction(model: Partial<Project>) {
    return this.api.update(new Project(model));
  }
}

EditComponent.linkComponentToPageInfo({
  category: projectCategory,
  menus: {
    actions: List([projectMenuItem, ...projectMenuItemActions]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
}).andMenuRoute(editProjectMenuItem);

export { EditComponent };
