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
    this.model.projects = this.project ? [this.project] : [];
    this.model.regions = this.region ? [this.region] : [];
    this.model.sites = this.site ? [this.site] : [];
    this.updateHref();
  }

  public ngAfterViewInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.updateHref();
    });
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

  public updateHref(): void {
    this.href = this.recordingsApi.batchDownloadUrl(this.generateFilter());
  }

  private generateFilter(): Filters<AudioRecording> {
    const filter: InnerFilter<AudioRecording> = {};

    if (this.model.sites.length > 0) {
      filter["sites.id"] = { in: this.model.sites.map((site) => site.id) };
    } else if (this.model.regions.length > 0) {
      filter["sites.regions.id"] = {
        in: this.model.regions.map((region) => region.id),
      };
    } else if (this.model.projects.length > 0) {
      filter["sites.regions.project.id"] = {
        in: this.model.projects.map((project) => project.id),
      };
    }

    if (this.model.recordingStartedAfter) {
      filter.recordedDate = {
        greaterThan: this.model.recordingStartedAfter.toISOString(),
      };
    }
    if (this.model.recordingFinishedBefore) {
      filter["recordedEndDate"] = {
        lessThan: this.model.recordingFinishedBefore.toISOString(),
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
