import { Component } from "@angular/core";
import { withFormCheck } from "@guards/form/form.guard";
import { PageComponent } from "@helpers/page/pageComponent";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";
import {
  fields as requestFields,
  fields as annotationFields,
} from "./data-request.schema.json";

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

    <baw-form
      title="Annotations Download"
      subTitle="Please select the timezone for the CSV file containing annotations for ..."
      submitLabel="Download Annotations"
      [model]="annotationModel"
      [fields]="annotationFields"
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
    ></baw-form>
  `,
})
class DataRequestComponent extends withFormCheck(PageComponent) {
  public annotationModel = {};
  public annotationFields = annotationFields;
  public requestModel = {};
  public requestFields = requestFields;
}

DataRequestComponent.linkComponentToPageInfo({
  category: dataRequestCategory,
}).andMenuRoute(dataRequestMenuItem);

export { DataRequestComponent };
