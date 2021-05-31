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
import { fields } from "./annotations-download.schema.json";

interface TimezoneModel {
  timezone?: string;
}

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

// TODO This will be expanded to download user annotations as well

@Component({
  selector: "baw-annotation-download",
  templateUrl: "./annotation-download.component.html",
  styleUrls: ["./annotation-download.component.scss"],
})
export class AnnotationDownloadComponent implements OnInit, ModalComponent {
  public closeModal!: (result: any) => void;
  public dismissModal!: (reason: any) => void;
  public failure: boolean;
  public fields: FormlyFieldConfig[] = fields;
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
    if (!models) {
      this.failure = true;
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
