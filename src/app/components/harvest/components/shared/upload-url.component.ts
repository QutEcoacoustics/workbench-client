import { Component, Input } from "@angular/core";
import { Harvest } from "@models/Harvest";

@Component({
  selector: "baw-harvest-upload-url",
  template: `
    <p>
      Server URL:
      <a [href]="harvest.uploadUrlWithAuth | safe: 'url'">
        {{ harvest.uploadUrl }}
      </a>
    </p>

    <p>Username: {{ harvest.uploadUser }}</p>
    <p>Password: {{ harvest.uploadPassword }}</p>
  `,
})
export class UploadUrlComponent {
  @Input() public harvest: Harvest;
}
