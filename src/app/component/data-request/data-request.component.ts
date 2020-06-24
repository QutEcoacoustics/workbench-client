import { Component, OnInit } from "@angular/core";
import { WithFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { Page } from "@helpers/page/pageDecorator";
import { AppConfigService } from "@services/app-config/app-config.service";
import { List } from "immutable";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";
import { fields as requestFields } from "./data-request.schema.json";
import { fields as annotationFields } from "./download-annotations.schema.json";

@Page({
  category: dataRequestCategory,
  menus: {
    actions: List(),
    links: List(),
  },
  self: dataRequestMenuItem,
})
@Component({
  selector: "app-data-request",
  template: `
    <baw-wip>
      <h1>Data Request</h1>
      <baw-cms [page]="page"></baw-cms>
      <baw-form
        title="Annotations Download"
        subTitle="Please select the timezone for the CSV file containing annotations for ..."
        [model]="annotationModel"
        [fields]="annotationFields"
        [submitLabel]="'Download Annotations'"
        [submitLoading]="annotationLoading"
        (onSubmit)="submitDownloadAnnotation($event)"
      ></baw-form>
      <baw-form
        title="Custom Data Request"
        subTitle="Use this form to request a customized annotations list or other data related to the audio recordings on this website. You <strong>do not need</strong> to use this form if you need the standard <strong>annotations CSV</strong> download. "
        [model]="requestModel"
        [fields]="requestFields"
        [submitLabel]="'Submit'"
        [submitLoading]="requestLoading"
        (onSubmit)="submitDataRequest($event)"
      ></baw-form>
    </baw-wip>
  `,
})
export class DataRequestComponent extends WithFormCheck(PageComponent)
  implements OnInit {
  public annotationLoading: boolean;
  public annotationModel = {};
  public annotationFields = annotationFields;
  public page: string;
  public requestLoading: boolean;
  public requestModel = {};
  public requestFields = requestFields;

  constructor(private env: AppConfigService) {
    super();
  }

  ngOnInit() {
    this.page = this.env.values.cms.downloadAnnotations;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submitDownloadAnnotation($event: any) {
    this.annotationLoading = true;
    console.log($event);
    this.annotationLoading = false;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  submitDataRequest($event: any) {
    this.requestLoading = true;
    console.log($event);
    this.requestLoading = false;
  }
}
