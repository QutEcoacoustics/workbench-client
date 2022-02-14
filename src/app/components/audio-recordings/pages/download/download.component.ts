import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters, InnerFilter } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { ResolvedModelList, retrieveResolvers } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { contactUsMenuItem } from "@components/about/about.menus";
import {
  audioRecordingMenuItems,
  audioRecordingsCategory,
} from "@components/audio-recordings/audio-recording.menus";
import { myAccountMenuItem } from "@components/profile/profile.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo, PageInfo } from "@helpers/page/pageInfo";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { takeUntil } from "rxjs";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

interface Model {
  projects?: Project[];
  regions?: Region[];
  sites?: Site[];
  recordingStartedAfter?: Date;
  recordingFinishedBefore?: Date;
}

@Component({
  selector: "baw-download",
  templateUrl: "download.component.html",
})
class DownloadAudioRecordingsComponent
  extends PageComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(NgForm) public form: NgForm;

  public contactUs = contactUsMenuItem;
  public href = "";
  public model: Model = {};
  public models: ResolvedModelList;
  public profile = myAccountMenuItem;

  public constructor(
    private route: ActivatedRoute,
    private recordingsApi: AudioRecordingsService
  ) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(new PageInfo(this.route.snapshot.data));
    this.models = models;
    this.updateHref(this.model);
  }

  public ngAfterViewInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((model: Model): void => this.updateHref(model));
  }

  public get project(): Project {
    return this.models[projectKey] as Project;
  }

  public get region(): Region {
    return this.models[regionKey] as Region;
  }

  public get site(): Site {
    return this.models[siteKey] as Site;
  }

  public updateHref(model: Model): void {
    this.href = this.recordingsApi.batchDownloadUrl(this.generateFilter(model));
  }

  private generateFilter(model: Model): Filters<AudioRecording> {
    const filter: InnerFilter<AudioRecording> = {};

    if (this.site) {
      filter["sites.id"] = { eq: this.site.id };
    } else if (this.region) {
      filter["regions.id"] = { eq: this.region.id };
    } else if (this.project) {
      filter["projects.id"] = { eq: this.project.id };
    }

    if (model.recordingStartedAfter) {
      filter["recordedDate"] = {
        greaterThan: model.recordingStartedAfter.toISOString(),
      };
    }
    if (model.recordingFinishedBefore) {
      filter["recordedEndDate"] = {
        lessThan: model.recordingFinishedBefore.toISOString(),
      };
    }

    return { filter: filter as InnerFilter<AudioRecording> };
  }
}

function getPageInfo(
  subRoute: keyof typeof audioRecordingMenuItems.batch
): IPageInfo {
  return {
    pageRoute: audioRecordingMenuItems.batch[subRoute],
    category: audioRecordingsCategory,
    resolvers: {
      [projectKey]: projectResolvers.show,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

DownloadAudioRecordingsComponent.linkToRoute(getPageInfo("project"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("siteAndRegion"))
  .linkToRoute(getPageInfo("site"));

export { DownloadAudioRecordingsComponent };
