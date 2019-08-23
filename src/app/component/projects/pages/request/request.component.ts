import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator.js";
import {
  projectsCategory,
  requestProjectMenuItem
} from "../../projects.menus.js";
import data from "./request.json";

@Page({
  category: projectsCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: requestProjectMenuItem
})
@Component({
  selector: "app-projects-request",
  template: `
    <app-form
      [schema]="schema"
      [title]="'Request project access'"
      [error]="error"
      [submitLabel]="'Submit request'"
      [submitLoading]="loading"
      (onSubmit)="submit($event)"
    ></app-form>
  `
})
export class RequestComponent extends PageComponent implements OnInit {
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
