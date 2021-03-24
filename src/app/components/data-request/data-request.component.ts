import { Component, OnInit } from "@angular/core";
import { PageComponent } from "@helpers/page/pageComponent";
import { dataRequestCategory, dataRequestMenuItem } from "./data-request.menus";

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

    <baw-request-annotations></baw-request-annotations>
    <baw-request-custom></baw-request-custom>
  `,
})
class DataRequestComponent extends PageComponent implements OnInit {
  public ngOnInit() {}
}

DataRequestComponent.linkComponentToPageInfo({
  category: dataRequestCategory,
}).andMenuRoute(dataRequestMenuItem);

export { DataRequestComponent };
