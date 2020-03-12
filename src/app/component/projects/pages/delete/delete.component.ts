import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { DeleteFormTemplate } from "src/app/helpers/formTemplate/deleteTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  deleteProjectMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: deleteProjectMenuItem
})
@Component({
  selector: "app-projects-delete",
  template: `
    <app-form
      *ngIf="models"
      [schema]="{ model: {}, fields: [] }"
      [title]="'Are you certain you wish to delete ' + getProject().name + '?'"
      [btnColor]="'btn-danger'"
      [submitLabel]="'Delete'"
      [submitLoading]="loading"
      (onSubmit)="submit()"
    ></app-form>
  `
})
export class DeleteComponent extends DeleteFormTemplate<Project> {
  constructor(
    private api: ProjectsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(["project"], [], notifications, route, router);
  }

  public getProject(): Project {
    return this.models.project as Project;
  }

  apiDestroy() {
    const project = this.getProject();
    return this.api.destroy(project);
  }

  successMessage() {
    return "Successfully deleted " + this.getProject().name;
  }

  redirectPath() {
    return projectsMenuItem.route.toString();
  }
}
