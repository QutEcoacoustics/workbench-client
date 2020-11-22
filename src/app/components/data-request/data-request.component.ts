import { Component } from "@angular/core";
import { WithFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";
import { fields as requestFields } from "./data-request.schema.json";
import { fields as annotationFields } from "./download-annotations.schema.json";

@Component({
  selector: "baw-data-request",
  template: `
    <h1>Data Request</h1>

    <h2>Annotations Download</h2>

    <p>To download a standard CSV of annotations</p>

    <ol>
      <li>Navigate to the project you're interested in</li>
      <li>Then, choose the site you want to download annotations for</li>
      <li>Finally, click the <i>Download annotations</i> link</li>
    </ol>

    <baw-wip>
      <baw-form
        title="Annotations Download"
        subTitle="Please select the timezone for the CSV file containing annotations for ..."
        submitLabel="Download Annotations"
        [model]="annotationModel"
        [fields]="annotationFields"
        [submitLoading]="annotationLoading"
        (onSubmit)="submitDownloadAnnotation($event)"
      ></baw-form>
      <baw-form
        title="Custom Data Request"
        subTitle="
          Use this form to request a customized annotations list or other data related to the
          audio recordings on this website. You <strong>do not need</strong> to use this form
          if you need the standard <strong>annotations CSV</strong> download.
        "
        submitLabel="Submit"
        [model]="requestModel"
        [fields]="requestFields"
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
  public requestLoading: boolean;
  public requestModel = {};
  public requestFields = requestFields;

  /**
   * Form submission
   *
   * @param $event Form response
   */
  public submitDownloadAnnotation($event: any) {
    this.annotationLoading = true;
    console.log($event);
    this.annotationLoading = false;
  }

  /**
   * Form submission
   *
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
