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
} from "@component/projects/projects.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { Page } from "@helpers/page/pageDecorator";
import { Project } from "@models/Project";
import { PermissionsShieldComponent } from "@shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@shared/widget/widgetItem";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { fields } from "../../project.schema.json";
import { projectMenuItemActions } from "../details/details.component";
import { projectErrorMsg } from "../new/new.component";

const projectKey = "project";

@Page({
  category: projectCategory,
  menus: {
    actions: List([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List(),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
  },
  self: editProjectMenuItem,
})
@Component({
  selector: "app-project-edit",
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
export class EditComponent extends FormTemplate<Project> implements OnInit {
  public fields = fields;
  public title: string;

  constructor(
    private api: ProjectsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(
      notifications,
      route,
      router,
      projectKey,
      (model) => defaultSuccessMsg("updated", model.name),
      projectErrorMsg
    );
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
