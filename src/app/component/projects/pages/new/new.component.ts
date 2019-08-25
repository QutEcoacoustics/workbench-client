import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
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
    <app-form
      [schema]="schema"
      [title]="'New Project'"
      [error]="error"
      [submitLabel]="'Submit'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class NewComponent extends PageComponent implements OnInit {
  schema = data;
  error: string;
  loading: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
    this.loading = false;
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
