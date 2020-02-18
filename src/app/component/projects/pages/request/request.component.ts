import { Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem
} from "../../projects.menus";
import { projectsMenuItemActions } from "../list/list.component";
import data from "./request.json";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, ...projectsMenuItemActions]),
    links: List()
  },
  canDeactivate: true,
  self: requestProjectMenuItem
})
@Component({
  selector: "app-projects-request",
  template: `
    <app-wip>
      <app-form
        [schema]="schema"
        [title]="'Request project access'"
        [error]="error"
        [submitLabel]="'Submit request'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
      <app-error-handler [error]="errorDetails"></app-error-handler>
    </app-wip>
  `
})
export class RequestComponent extends PageComponent
  implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  schema: any;
  error: string;
  errorDetails: ApiErrorDetails;
  loading: boolean;

  constructor(private api: ProjectsService) {
    super();
  }

  ngOnInit() {
    this.loading = false;

    // TODO Change this to the list of projects a user does not have access to
    this.schema = data;
    this.api
      .list()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        projects => {
          this.schema.fields[0].templateOptions.options = projects.map(
            project => {
              return {
                value: project.id,
                label: project.name
              };
            }
          );
        },
        (err: ApiErrorDetails) => (this.errorDetails = err)
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    console.log($event);
    this.loading = false;
  }
}
