import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  projectResolvers,
  ProjectsService,
} from "@baw-api/project/projects.service";
import {
  deleteProjectMenuItem,
  projectCategory,
  projectsMenuItem,
} from "@components/projects/projects.menus";
import {
  defaultSuccessMsg,
  FormTemplate,
} from "@helpers/formTemplate/formTemplate";
import { permissionsWidgetMenuItem } from "@menu/widget.menus";
import { Project } from "@models/Project";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { projectMenuItemActions } from "../details/details.component";

const projectKey = "project";

/**
 * Delete Project Component
 */
@Component({
  selector: "baw-projects-delete",
  template: `
    <baw-form
      *ngIf="!failure"
      [title]="title"
      [model]="model"
      [fields]="fields"
      btnColor="danger"
      submitLabel="Delete"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></baw-form>
  `,
})
class DeleteComponent extends FormTemplate<Project> implements OnInit {
  public title: string;

  public constructor(
    private api: ProjectsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(notifications, route, router, {
      getModel: (models) => models[projectKey] as Project,
      successMsg: (model) => defaultSuccessMsg("destroyed", model.name),
      redirectUser: () =>
        this.router.navigateByUrl(projectsMenuItem.route.toRouterLink()),
    });
  }

  public ngOnInit() {
    super.ngOnInit();

    if (!this.failure) {
      this.title = `Are you certain you wish to delete ${this.model.name}?`;
    }
  }

  protected apiAction(model: Partial<Project>) {
    return this.api.destroy(new Project(model));
  }
}

DeleteComponent.linkToRoute({
  category: projectCategory,
  pageRoute: deleteProjectMenuItem,
  menus: {
    actions: List(projectMenuItemActions),
    actionWidgets: List([permissionsWidgetMenuItem]),
  },
  resolvers: { [projectKey]: projectResolvers.show },
});

export { DeleteComponent };
