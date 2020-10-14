import { Component } from "@angular/core";
import { CMS } from "@baw-api/cms/cms.service";
import { WithFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";
import { fields as requestFields } from "./data-request.schema.json";
import { fields as annotationFields } from "./download-annotations.schema.json";

@Component({
  selector: "baw-data-request",
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
class DataRequestComponent extends WithFormCheck(PageComponent) {
  public annotationLoading: boolean;
  public annotationModel = {};
  public annotationFields = annotationFields;
  public page = CMS.DATA_UPLOAD;
  public requestLoading: boolean;
  public requestModel = {};
  public requestFields = requestFields;

  /**
   * Form submission
   * @param $event Form response
   */
  public submitDownloadAnnotation($event: any) {
    this.annotationLoading = true;
    console.log($event);
    this.annotationLoading = false;
  }

  /**
   * Form submission
   * @param $event Form response
   */
  public submitDataRequest($event: any) {
    this.requestLoading = true;
    console.log($event);
    this.requestLoading = false;
  }
}

DataRequestComponent.LinkComponentToPageInfo({
  category: dataRequestCategory,
}).AndMenuRoute(dataRequestMenuItem);

export { DataRequestComponent };
