import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import data from "./data-request.json";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";

@Page({
  category: dataRequestCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: dataRequestMenuItem
})
@Component({
  selector: "app-data-request",
  template: `
    <h1>Data Request</h1>
    <app-cms page="annotationsDownload.html"></app-cms>
    <app-cms page="dataRequest.html"></app-cms>
    <app-wip>
      <app-form
        [schema]="schema"
        [error]="error"
        [submitLabel]="'Submit'"
        [submitLoading]="loading"
        (onSubmit)="submit($event)"
      ></app-form>
    </app-wip>
  `
})
export class DataRequestComponent extends PageComponent implements OnInit {
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
