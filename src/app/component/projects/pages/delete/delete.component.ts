import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import {
  defaultSuccessMsg,
  FormTemplate
} from "src/app/helpers/formTemplate/formTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import {
  projectResolvers,
  ProjectsService
} from "src/app/services/baw-api/projects.service";
import {
  deleteProjectMenuItem,
  projectCategory,
  projectMenuItem,
  projectsMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

/**
 * Delete Project Component
 */
@Page({
  category: projectCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  resolvers: {
    [projectKey]: projectResolvers.show
  },
  self: deleteProjectMenuItem
})
@Component({
  selector: "app-projects-delete",
  template: `
    <app-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="btn-danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class DeleteComponent extends FormTemplate<Project> implements OnInit {
  public fields = [];
  public title: string;

  constructor(
    private api: ProjectsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, projectKey, model =>
      defaultSuccessMsg("destroyed", model.name)
    );
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.name}?`;
    }
  }

  protected redirectionPath() {
    return projectsMenuItem.route.toString();
  }

  protected apiAction(model: Partial<Project>) {
    return this.api.destroy(new Project(model));
  }
}
