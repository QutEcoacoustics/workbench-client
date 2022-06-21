import { Component, Input } from "@angular/core";
import { Harvest } from "@models/Harvest";

@Component({
  selector: "baw-harvest-progress",
  template: `
    <h4>Current Progress</h4>

    <ul>
      <li><b>Uploaded Files: </b>{{ harvest.report.itemsTotal }}</li>
      <li>
        <b>Uploaded Bytes: </b>{{ harvest.report.itemsSizeBytes }} ({{
          harvest.report.itemsSize
        }})
      </li>
    </ul>
  `,
})
export class HarvestProgressComponent {
  @Input() public harvest: Harvest;
}
