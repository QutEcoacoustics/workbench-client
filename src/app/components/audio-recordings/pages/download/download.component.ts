import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import {
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
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { DateTime } from "luxon";
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
  todStartedAfter?: Date;
  todFinishedBefore?: Date;
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

  public filters$: Subject<Filters<AudioRecording>>;
  public recordings$: Observable<AudioRecording[]>;

  public contactUs = contactUsMenuItem;
  public href = "";
  public model: Model = { todIgnoreDst: true };
  public models: ResolvedModelList;
  public profile = myAccountMenuItem;

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

  public updateHref(model: Model): void {
    console.log(model);
    const filters = this.generateFilter(model);
    console.log(filters);
    this.filters$.next(filters);
    this.href = this.recordingsApi.batchDownloadUrl(filters);
  }

  public getNewestRecording(recordings: AudioRecording[]) {
    return recordings
      .reduce((a, b) => (a.recordedDate > b.recordedDate ? a : b))
      .recordedDate.toFormat("yyyy-MM-dd hh:mm:ss");
  }

  public getOldestRecording(recordings: AudioRecording[]) {
    return recordings
      .reduce((a, b) => (a.recordedDate < b.recordedDate ? a : b))
      .recordedDate.toFormat("yyyy-MM-dd hh:mm:ss");
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

    const todFilter = this.timeOfDayFilter(model);
    const dateFilter = this.dateFilter(model);
    const hasTodFilter = Object.keys(todFilter).length > 0;
    const hasDateFilter = Object.keys(dateFilter).length > 0;

    if (hasTodFilter && hasDateFilter) {
      return { filter: { and: { ...todFilter, ...dateFilter } } };
    } else if (hasTodFilter) {
      return { filter: todFilter };
    } else if (hasDateFilter) {
      return { filter: dateFilter };
    } else {
      return {};
    }
  }

  private dateFilter(model: Model): InnerFilter<AudioRecording> {
    const filter: InnerFilter<AudioRecording> = {};

    if (model.startedAfter) {
      filter["recordedDate"] = {
        gteq: model.startedAfter.toISOString(),
      };
    }

    if (model.finishedBefore) {
      filter["recordedEndDate"] = {
        lteq: model.finishedBefore.toISOString(),
      };
    }

    return filter;
  }

  private timeOfDayFilter(model: Model): InnerFilter<AudioRecording> {
    if (!model.todEnabled) {
      return {};
    }

    const filter: InnerFilter<AudioRecording> = {};
    const expressions: DateExpressions[] = model.todIgnoreDst
      ? ["local_offset", "time_of_day"]
      : ["local_tz", "time_of_day"];

    if (model.todStartedAfter) {
      filter["recordedEndDate"] = {
        greaterThanOrEqual: {
          expressions,
          value: model.todStartedAfter.toTimeString().split(" ")[0],
        },
      };
    }

    if (model.todFinishedBefore) {
      filter["recordedDate"] = {
        lessThanOrEqual: {
          expressions,
          value: model.todFinishedBefore.toTimeString().split(" ")[0],
        },
      };
    }

    return filter;
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
