import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import {
  Comparisons,
  DateExpressions,
  Filters,
  InnerFilter,
} from "@baw-api/baw-api.service";
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
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { isUnresolvedModel } from "@models/AbstractModel";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import { defaultDebounceTime } from "src/app/app.helper";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

interface Model {
  projects?: Project[];
  regions?: Region[];
  sites?: Site[];
  startedAfter?: Date;
  finishedBefore?: Date;
  todEnabled?: boolean;
  todIgnoreDst?: boolean;
  todStartedAfter?: string;
  todFinishedBefore?: string;
}

@Component({
  selector: "baw-download",
  templateUrl: "download.component.html",
  styleUrls: ["download.component.scss"],
})
class DownloadAudioRecordingsComponent
  extends PageComponent
  implements OnInit, AfterViewInit
{
  @ViewChild(NgForm) public form: NgForm;

  public filters$: Subject<Filters<AudioRecording>>;
  public recordings$: Observable<AudioRecording[]>;

  public contactUs = contactUsMenuItem;
  public href = "";
  public model: Model = { todIgnoreDst: true };
  public models: ResolvedModelList;
  public profile = myAccountMenuItem;

  public errors: {
    todBoundaryError?: boolean;
  } = {};

  public constructor(
    private route: ActivatedRoute,
    private recordingsApi: AudioRecordingsService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.filters$ = new Subject();
    this.recordings$ = this.filters$.pipe(
      debounceTime(defaultDebounceTime),
      distinctUntilChanged(),
      switchMap((filters: Filters<AudioRecording>) =>
        this.recordingsApi.filter(filters)
      )
    );

    this.models = retrieveResolvers(this.route.snapshot.data);
    this.updateHref(this.model);
  }

  public ngAfterViewInit(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((model: Model): void => {
        this.updateHref(model);
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

  public sitesWithoutTimezones(
    site?: Site,
    regionSites?: Site[],
    projectSites?: Site[]
  ): Site[] {
    if (site) {
      return site.timezoneInformation ? [] : [site];
    }

    if (regionSites) {
      if (!isInstantiated(regionSites) || isUnresolvedModel(regionSites)) {
        return [];
      } else {
        return regionSites.filter((s) => !s.timezoneInformation);
      }
    }

    if (projectSites) {
      if (!isInstantiated(projectSites) || isUnresolvedModel(projectSites)) {
        return [];
      } else {
        return projectSites.filter((s) => !s.timezoneInformation);
      }
    }
  }

  public updateHref(model: Model): void {
    const filters = this.generateFilter(model);
    this.filters$.next(filters);
    this.href = this.recordingsApi.batchDownloadUrl(filters);
  }

  public getNumberOfRecordings(recordings: AudioRecording[]): number {
    if (recordings.length === 0) {
      return 0;
    }
    return recordings[0].getMetadata().paging.total;
  }

  public getNewestRecording(recordings: AudioRecording[]): string {
    if (recordings.length === 0) {
      return "No recordings";
    }

    return recordings
      .reduce((a, b) => (a.recordedDate > b.recordedDate ? a : b))
      .recordedDate.toFormat("yyyy-MM-dd hh:mm:ss");
  }

  public getOldestRecording(recordings: AudioRecording[]): string {
    if (recordings.length === 0) {
      return "No recordings";
    }

    return recordings
      .reduce((a, b) => (a.recordedDate < b.recordedDate ? a : b))
      .recordedDate.toFormat("yyyy-MM-dd hh:mm:ss");
  }

  public invalidForm(errors: any): boolean {
    return Object.entries(errors).some((value) => value[1]);
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

    this.setDateFilter(filter, model);
    this.setTimeOfDayFilter(filter, model);

    return { filter };
  }

  private setDateFilter(
    filter: InnerFilter<AudioRecording>,
    model: Model
  ): void {
    if (model.startedAfter) {
      filter["recordedDate"] ??= {};
      filter["recordedDate"].greaterThanOrEqual =
        model.startedAfter.toISOString();
    }

    if (model.finishedBefore) {
      filter["recordedEndDate"] ??= {};
      (filter["recordedEndDate"] as Comparisons).lessThanOrEqual =
        model.finishedBefore.toISOString();
    }
  }

  private setTimeOfDayFilter(
    filter: InnerFilter<AudioRecording>,
    model: Model
  ): void {
    if (
      !model.todEnabled ||
      model.todFinishedBefore === model.todStartedAfter
    ) {
      return;
    }

    const expressions: DateExpressions[] = model.todIgnoreDst
      ? ["local_offset", "time_of_day"]
      : ["local_tz", "time_of_day"];

    if (model.todStartedAfter) {
      filter["recordedEndDate"] ??= {};
      (filter["recordedEndDate"] as Comparisons).greaterThanOrEqual = {
        expressions,
        value: model.todStartedAfter,
      };
    }

    if (model.todFinishedBefore) {
      filter["recordedDate"] ??= {};
      filter["recordedDate"].lessThanOrEqual = {
        expressions,
        value: model.todFinishedBefore,
      };
    }

    // TODO Add support for timezones which overflow a boundary
    if (model.todFinishedBefore < model.todStartedAfter) {
      this.errors.todBoundaryError = true;
      console.log("Finish time is before start time");
    } else {
      this.errors.todBoundaryError = false;
    }
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
