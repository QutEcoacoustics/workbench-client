import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import {
  newProjectMenuItem,
  projectsCategory,
  projectsMenuItem,
  requestProjectMenuItem
} from "../../projects.menus";
import data from "./new.json";

@Page({
  category: projectsCategory,
  menus: {
    actions: List<AnyMenuItem>([
      projectsMenuItem,
      newProjectMenuItem,
      requestProjectMenuItem
    ]),
    links: List()
  },
  self: newProjectMenuItem
})
@Component({
  selector: "app-projects-new",
  template: `
    <app-wip>
      <app-form
        [schema]="schema"
        [title]="'New Project'"
        [error]="error"
        [success]="success"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class NewComponent extends PageComponent implements OnInit, OnDestroy {
  error: string;
  loading: boolean;
  schema = data;
  subSink: SubSink = new SubSink();
  success: string;

  constructor(private api: ProjectsService, private ref: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.loading = false;
  }

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submit($event: any) {
    this.loading = true;
    this.ref.detectChanges();

    console.log($event);
    this.subSink.sink = this.api.newProject($event).subscribe(
      () => {
        this.success = "Project was successfully created.";
        this.loading = false;
      },
      err => {
        this.error = err;
        this.loading = false;
      }
    );
  }
}
