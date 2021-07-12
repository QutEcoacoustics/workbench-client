import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { retrieveResolvers } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { PageInfo } from "@helpers/page/pageInfo";
import { ModalComponent } from "@menu/widget.component";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { FormlyFieldConfig } from "@ngx-formly/core";
import schema from "./annotations-download.schema.json";

interface TimezoneModel {
  timezone?: string;
}

// TODO This needs to be standardized, otherwise it may not work
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

// TODO This will be expanded to download user annotations as well
@Component({
  selector: "baw-annotation-download",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Annotations Download</h4>
      <button
        type="button"
        class="close"
        aria-label="Close"
        (click)="dismissModal('Exit')"
      >
        <fa-icon [icon]="['fas', 'times']"></fa-icon>
      </button>
    </div>

    <div class="modal-body">
      <baw-form [submitLabel]="null" [model]="model" [fields]="fields">
        <span id="subTitle">
          <p>
            The annotations in the CSV will have all their dates and times set
            to a time zone of your choice. The default time zone is the local
            time for the
            {{ region ? "point" : "site" }} where the audio was recorded.
          </p>
          <p>
            For example, annotations created for audio from Brisbane will have
            dates and times set to AEST (+10).
          </p>
          <p>
            However, if you have recordings from Brisbane and Perth, which time
            zone do we choose for all downloaded events?
          </p>
          <p>AEST (+10) or AWST (+8) or UTC (+0)?</p>
          <p>
            It depends on how you want to work with your data, so the choice is
            yours. Please select the time zone you wish to use:
          </p>
        </span>
      </baw-form>
    </div>

    <div class="modal-footer">
      <a class="btn btn-primary" [href]="getAnnotationsPath()">
        Download Annotations
      </a>
    </div>
  `,
})
export class AnnotationDownloadComponent implements OnInit, ModalComponent {
  public closeModal!: (result: any) => void;
  public dismissModal!: (reason: any) => void;
  public fields: FormlyFieldConfig[] = schema.fields;
  public form = new FormGroup({});
  public model: TimezoneModel = { timezone: "UTC" };
  public pageData!: any;
  public routeData!: PageInfo;
  public project?: Project;
  public region?: Region;
  public site?: Site;

  public constructor(protected siteApi: SitesService) {}

  public ngOnInit(): void {
    const models = retrieveResolvers(this.routeData);

    // Close modal if an error has occurred
    if (!models) {
      this.dismissModal("Failure to resolve models");
      return;
    }

    this.project = models[projectKey] as Project;
    this.region = models[regionKey] as Region;
    this.site = models[siteKey] as Site;
    this.model.timezone = this.site.tzinfoTz ?? this.model.timezone;
  }

  public getAnnotationsPath(): string {
    return this.siteApi.downloadAnnotations(
      this.site,
      this.region?.projectId ?? this.project,
      this.model.timezone
    );
  }
}
