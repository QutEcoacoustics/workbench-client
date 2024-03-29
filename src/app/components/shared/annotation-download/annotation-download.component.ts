import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  hasResolvedSuccessfully,
  retrieveResolvedModel,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { IPageInfo } from "@helpers/page/pageInfo";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ModalComponent } from "@menu/widget.component";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { SharedActivatedRouteService } from "@services/shared-activated-route/shared-activated-route.service";
import { takeUntil } from "rxjs";
import schema from "./annotations-download.schema.json";

interface TimezoneModel {
  timezone?: string;
}

// TODO This will be expanded to download user annotations as well
@Component({
  selector: "baw-annotation-download",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Annotations Download</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="dismissModal('Exit')"
      ></button>
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
  styles: [
    `
      /* Otherwise timezone selector cannot be seen on firefox */
      .modal-body {
        overflow-y: unset;
      }
    `,
  ],
})
export class AnnotationDownloadComponent
  extends withUnsubscribe()
  implements OnInit, ModalComponent
{
  public closeModal!: (result: any) => void;
  public dismissModal!: (reason: any) => void;
  public fields: FormlyFieldConfig[] = schema.fields;
  public form = new FormGroup({});
  public model: TimezoneModel = { timezone: "UTC" };
  public project?: Project;
  public region?: Region;
  public site?: Site;

  public constructor(
    private siteApi: SitesService,
    private sharedRoute: SharedActivatedRouteService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.sharedRoute.pageInfo
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((pageInfo: IPageInfo) => {
        const models = retrieveResolvers(pageInfo);

        // Close modal if an error has occurred
        if (!hasResolvedSuccessfully(models)) {
          this.dismissModal("Failure to resolve models");
          return;
        }

        this.project = retrieveResolvedModel(pageInfo, Project);
        this.region = retrieveResolvedModel(pageInfo, Region);
        this.site = retrieveResolvedModel(pageInfo, Site);
        this.model.timezone = this.site.tzinfoTz ?? this.model.timezone;
      });
  }

  public getAnnotationsPath(): string {
    // if the timezone is UTC, vvo/tzdb will return Etc/UTC
    // because the API expects UTC timezones to have the value "UTC", we change "Etc/UTC" to "UTC" when we send the
    // download request to the API
    const timezone =
      this.model.timezone === "Etc/UTC" ? "UTC" : this.model.timezone;

    return this.siteApi.downloadAnnotations(
      this.site,
      this.region?.projectId ?? this.project,
      timezone
    );
  }
}
