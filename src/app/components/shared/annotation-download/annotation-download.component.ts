import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { SitesService } from "@baw-api/site/sites.service";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { fields } from "./annotations-download.schema.json";

interface TimezoneModel {
  timezone?: string;
}

// TODO This will be expanded to download user annotations as well

@Component({
  selector: "baw-annotation-download",
  templateUrl: "./annotation-download.component.html",
  styleUrls: ["./annotation-download.component.scss"],
})
export class AnnotationDownloadComponent implements OnInit {
  @ViewChild("content") private modelContent!: ElementRef;

  public fields: FormlyFieldConfig[] = fields;
  public form = new FormGroup({});
  public model: TimezoneModel = { timezone: "UTC" };
  @Input() public project!: Project;
  @Input() public region?: Region;
  @Input() public site!: Site;

  public constructor(
    protected siteApi: SitesService,
    private modal: NgbModal
  ) {}

  public ngOnInit(): void {
    this.model.timezone = this.site.tzinfoTz ?? this.model.timezone;
    this.open();
  }

  public getAnnotationsPath(): string {
    return this.siteApi.downloadAnnotations(
      this.site,
      this.region?.projectId ?? this.project,
      this.model.timezone
    );
  }

  public open(): void {
    this.modal.open(this.modelContent, {
      ariaLabelledBy: "annotations-download",
    });
  }
}
