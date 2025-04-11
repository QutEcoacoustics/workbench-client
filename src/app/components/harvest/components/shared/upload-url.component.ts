import { Component, Input } from "@angular/core";
import { Harvest } from "@models/Harvest";
import { SafePipe } from "../../../../pipes/safe/safe.pipe";

@Component({
  selector: "baw-harvest-upload-url",
  template: `
    <p>
      <b>Server URL: </b
      ><a [href]="harvest.uploadUrlWithAuth | safe: 'url'">
        {{ harvest.uploadUrl }}
      </a>
    </p>

    <p><b>Username:</b> {{ harvest.uploadUser }}</p>
    <p><b>Password:</b> {{ harvest.uploadPassword }}</p>
  `,
  imports: [SafePipe],
})
export class UploadUrlComponent {
  @Input() public harvest: Harvest;
}
