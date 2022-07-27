import { Component, Input } from "@angular/core";
import { Harvest } from "@models/Harvest";

@Component({
  selector: "baw-harvest-upload-url",
  template: `
    <p>
      <b>Server URL:</b>
      <a [href]="harvest.uploadUrlWithAuth | safe: 'url'">
        {{ harvest.uploadUrl }}
      </a>
    </p>

    <p><b>Username:</b> {{ harvest.uploadUser }}</p>
    <p><b>Password:</b> {{ harvest.uploadPassword }}</p>
  `,
})
export class UploadUrlComponent {
  @Input() public harvest: Harvest;
}
