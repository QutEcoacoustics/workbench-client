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
import { BawSessionService } from "@baw-api/baw-session.service";
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
import { NgbDate, NgbDateParserFormatter } from "@ng-bootstrap/ng-bootstrap";
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
  dateFiltering?: boolean;
  dateStartedAfter?: NgbDate;
  dateFinishedBefore?: NgbDate;
  todFiltering?: boolean;
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
  public hoveredDate: NgbDate;

  public errors: {
    todBoundaryError?: boolean;
  } = {};

  public constructor(
    public session: BawSessionService,
    private route: ActivatedRoute,
    private recordingsApi: AudioRecordingsService,
    private formatter: NgbDateParserFormatter
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
      .pipe(
        debounceTime(defaultDebounceTime),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe)
      )
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

  public get runScriptCommand(): string {
    return `./download_audio_files.ps1 -auth_token "${
      this.session.authToken ?? "INSERT_AUTH_TOKEN_HERE"
    }"`;
  }

  public updateHref(model: Model): void {
    const filters = this.generateFilter(model);
    this.filters$.next(filters);
    this.href = this.recordingsApi.batchDownloadUrl(filters);
  }

  public invalidForm(errors: any): boolean {
    return Object.entries(errors).some((value) => value[1]);
  }

  public invalidDate(date: string | NgbDate): boolean {
    return typeof date === "string";
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
    if (!model.dateFiltering) {
      return;
    }

    if (model.dateStartedAfter instanceof NgbDate) {
      filter["recordedDate"] ??= {};
      filter["recordedDate"].greaterThanOrEqual = this.formatter.format(
        model.dateStartedAfter
      );
    }

    if (model.dateFinishedBefore instanceof NgbDate) {
      filter["recordedEndDate"] ??= {};
      (filter["recordedEndDate"] as Comparisons).lessThanOrEqual =
        this.formatter.format(model.dateFinishedBefore);
    }
  }

  private setTimeOfDayFilter(
    filter: InnerFilter<AudioRecording>,
    model: Model
  ): void {
    if (!model.todFiltering) {
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
    this.errors.todBoundaryError =
      model.todFinishedBefore &&
      model.todStartedAfter &&
      model.todFinishedBefore < model.todStartedAfter;
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
