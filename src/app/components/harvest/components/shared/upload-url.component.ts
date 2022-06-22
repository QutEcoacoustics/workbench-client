import { Component, Input } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Harvest } from "@models/Harvest";

@Component({
  selector: "baw-harvest-upload-url",
  template: `
    <p>
      Server URL:
      <a [href]="trustedUploadUrl">
        {{ harvest.uploadUrl }}
      </a>
    </p>

    <p>Username: {{ harvest.uploadUser }}</p>
    <p>Password: {{ harvest.uploadPassword }}</p>
  `,
})
export class UploadUrlComponent {
  @Input() public harvest: Harvest;

  public constructor(private domSanitizer: DomSanitizer) {}

  public get trustedUploadUrl(): SafeUrl {
    let url = this.harvest.uploadUrl;
    url = url.replace(
      "sftp://",
      "sftp://" +
        this.harvest.uploadUser +
        ":" +
        this.harvest.uploadPassword +
        "@"
    );
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
}
