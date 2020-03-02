import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { WithFormCheck } from "src/app/guards/form/form.guard";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { Project } from "src/app/models/Project.js";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
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
    <app-wip>
      <app-form
        *ngIf="success"
        [schema]="schema"
        [title]="'Edit Project'"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class EditComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public loading: boolean;
  public schema = { model: { name: "" }, fields };
  public success: boolean;
  public project: Project;

  constructor(
    private route: ActivatedRoute,
    private api: ProjectsService,
    private notification: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    const projectModel: ResolvedModel<Project> = this.route.snapshot.data
      .project;

    if (projectModel.error) {
      return;
    }

    this.project = projectModel.model;
    this.schema.model["name"] = this.project.name;
    this.success = true;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    const project = new Project({ ...$event, id: this.project.id });

    this.loading = true;

    this.api
      .update(project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        () => {
          this.notification.success("Project was successfully updated.");
          this.loading = false;
        },
        (err: ApiErrorDetails) => {
          if (err.info && err.info.name && err.info.name.length === 1) {
            this.notification.error(err.message + ": name " + err.info.name[0]);
          } else {
            this.notification.error(err.message);
          }
          this.loading = false;
        }
      );
  }
}
