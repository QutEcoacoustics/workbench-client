import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent.js";
import { Page } from "src/app/helpers/page/pageDecorator.js";
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
    <h2>Annotations Download</h2>
    <p>To download a standard CSV of annotations</p>
    <ol>
      <li>Navigate to the project you're interested in</li>
      <li>Then, choose the site you want to download annotations for</li>
      <li>Finally, click the <i>Download annotations</i> link</li>
    </ol>
    <h2>Custom Data Request</h2>
    <p>
      Use this form to request a customized annotations list or other data
      related to the audio recordings on this website.
      <br />
      You <strong>do not need</strong> to use this form if you need the standard
      <strong>annotations CSV</strong> download.
    </p>
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
