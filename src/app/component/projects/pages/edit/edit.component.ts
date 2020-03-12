import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { EditFormTemplate } from "src/app/helpers/formTemplate/editTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  editProjectMenuItem,
  projectCategory,
  projectMenuItem
} from "../../projects.menus";
import { projectMenuItemActions } from "../details/details.component";
import { fields } from "./edit.json";

@Page({
  category: projectCategory,
  menus: {
    actions: List([projectMenuItem, ...projectMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: editProjectMenuItem
})
@Component({
  selector: "app-project-edit",
  template: `
    <app-wip *ngIf="models">
      <app-form
        [schema]="schema"
        [title]="'Edit ' + getProject().name"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class EditComponent extends EditFormTemplate<Project, FormEvent> {
  constructor(
    private api: ProjectsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super(["project"], fields, notifications, route, router);
  }

  public getProject(): Project {
    return this.models.project as Project;
  }

  preFillForm() {
    const project = this.getProject();

    this.schema.model["name"] = project.name;
    this.schema.model["description"] = project.description;
  }

  apiUpdate(event: FormEvent) {
    const project = this.getProject();
    const updatedProject = new Project({ id: project.id, ...event });
    return this.api.update(updatedProject);
  }

  successMessage(model: Project) {
    return "Successfully updated " + model.name;
  }

  redirectPath(project: Project) {
    return project.redirectPath();
  }
}

interface FormEvent {
  name: string;
  description: string;
  image: any;
}
