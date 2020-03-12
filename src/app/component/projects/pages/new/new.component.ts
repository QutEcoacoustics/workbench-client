import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { NewFormTemplate } from "src/app/helpers/formTemplate/newTemplate";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { Project } from "src/app/models/Project";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem
} from "../../projects.menus";
import { projectsMenuItemActions } from "../list/list.component";
import { fields } from "./new.json";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, ...projectsMenuItemActions]),
    links: List()
  },
  self: newProjectMenuItem
})
@Component({
  selector: "app-projects-new",
  template: `
    <app-form
      [schema]="schema"
      [title]="'New Project'"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class NewComponent extends NewFormTemplate<Project, FormEvent> {
  constructor(
    private api: ProjectsService,
    notifications: ToastrService,
    route: ActivatedRoute,
    router: Router
  ) {
    super([], fields, notifications, route, router);
  }

  apiCreate(event: FormEvent) {
    return this.api.create(new Project({ ...event }));
  }

  successMessage(model: Project) {
    return "Successfully created " + model.name;
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
