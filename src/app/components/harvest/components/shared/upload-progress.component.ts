import { Component, Input } from "@angular/core";
import { Harvest } from "@models/Harvest";

@Component({
  selector: "baw-harvest-upload-progress",
  template: `
    <h4>Current Progress</h4>

    <ul>
      <li><b>Uploaded Files: </b>{{ harvest.report.itemsTotal | number }}</li>
      <li>
        <b>Uploaded Bytes: </b>{{ harvest.report.itemsSizeBytes | number }} ({{
          harvest.report.itemsSize
        }})
      </li>
    </ul>
  `,
})
export class UploadProgressComponent {
  @Input() public harvest: Harvest;
}
