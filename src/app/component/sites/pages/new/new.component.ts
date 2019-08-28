import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import {
  newProjectMenuItem,
  projectsMenuItem,
  requestProjectMenuItem
} from "src/app/component/projects/projects.menus";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { newSiteMenuItem, sitesCategory } from "../../sites.menus";
import data from "./new.json";

@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([projectsMenuItem, requestProjectMenuItem]),
    links: List()
  },
  self: newSiteMenuItem
})
@Component({
  selector: "app-sites-new",
  template: `
    <app-form
      [schema]="schema"
      [title]="'New Site'"
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
