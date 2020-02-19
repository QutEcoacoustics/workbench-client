import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import requestData from "./data-request.json";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";
import annotationData from "./download-annotations.json";

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
    <app-wip>
      <h1>Data Request</h1>
      <app-cms page="downloadAnnotations.html"></app-cms>
      <app-form
        title="Annotations Download"
        subTitle="Please select the timezone for the CSV file containing annotations for ..."
        [schema]="annotationSchema"
        [error]="error"
        [submitLabel]="'Download Annotations'"
        [submitLoading]="annotationLoading"
        (onSubmit)="submitAnnotation($event)"
      ></app-form>
      <app-form
        title="Custom Data Request"
        subTitle="Use this form to request a customized annotations list or other data related to the audio recordings on this website. You <strong>do not need</strong> to use this form if you need the standard <strong>annotations CSV</strong> download. "
        [schema]="requestSchema"
        [error]="error"
        [submitLabel]="'Submit'"
        [submitLoading]="requestLoading"
        (onSubmit)="submitRequest($event)"
      ></app-form>
    </app-wip>
  `
})
export class DataRequestComponent extends PageComponent implements OnInit {
  annotationSchema = annotationData;
  requestSchema = requestData;
  error: string;
  annotationLoading: boolean;
  requestLoading: boolean;

  constructor() {
    super();
  }

  ngOnInit() {
    this.requestLoading = false;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submitAnnotation($event: any) {
    this.annotationLoading = true;
    console.log($event);
    this.annotationLoading = false;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submitRequest($event: any) {
    this.requestLoading = true;
    console.log($event);
    this.requestLoading = false;
  }
}
