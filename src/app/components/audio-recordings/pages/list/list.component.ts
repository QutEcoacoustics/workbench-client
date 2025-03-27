import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  audioRecordingMenuItems,
  audioRecordingsCategory,
} from "@components/audio-recordings/audio-recording.menus";
import { visualizeMenuItem } from "@components/visualize/visualize.menus";
import { filterModel } from "@helpers/filters/filters";
import { IPageInfo } from "@helpers/page/pageInfo";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { licenseWidgetMenuItem } from "@menu/widget.menus";
import { WidgetMenuItem } from "@menu/widgetItem";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { ConfigService } from "@services/config/config.service";
import { API_ROOT } from "@services/config/config.tokens";
import { List } from "immutable";
import { Duration } from "luxon";
import { BehaviorSubject, Observable, takeUntil } from "rxjs";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

/**
 * List of all audio recordings, filtered by site, region, and project if
 * exists in route parameters. This component can be accessed from:
 * /audio_recordings
 */
@Component({
  selector: "baw-audio-recordings",
  templateUrl: "./list.component.html",
})
class AudioRecordingsListComponent
  extends PagedTableTemplate<TableRow, AudioRecording>
  implements OnInit, AfterViewInit
{
  public columns = [
    { name: "Recorded" },
    { name: "Duration" },
    { name: "Uploader" },
    { name: "Site" },
  ];
  public sortKeys = {
    uploader: "uploaderId",
    recorded: "recordedDate",
    duration: "durationSeconds",
    site: "siteId",
  };
  public filters$: BehaviorSubject<Filters<AudioRecording>> =
    new BehaviorSubject({});
  protected api: AudioRecordingsService;

  public constructor(
    @Inject(API_ROOT) public apiRoot: string,
    api: AudioRecordingsService,
    route: ActivatedRoute,
    private config: ConfigService
  ) {
    super(
      api,
      (recordings): TableRow[] =>
        recordings.map(
          (recording): TableRow => ({
            uploader: recording,
            timezone: recording,
            site: recording,
            // yyyy-mm-dd hh:mm
            recorded: recording,
            duration: recording.duration,
            model: recording,
          })
        ),
      route
    );

    // Set default filter
    this.filters.sorting = { orderBy: "recordedDate", direction: "asc" };
  }

  public ngAfterViewInit(): void {
    super.ngAfterViewInit?.();

    if (this.failure || !this.table) {
      return;
    }

    // Update table to show default sort
    this.table.sorts = [{ prop: "recorded", dir: "asc" }];
    this.filters$.pipe(takeUntil(this.unsubscribe)).subscribe((filters) => {
      this.updateFilters(filters);
    });
  }

  public get projectId(): number | undefined {
    return this.project?.id ?? this.region?.projectId;
  }

  public get project(): Project | undefined {
    return this.models[projectKey] as Project;
  }

  public get region(): Region | undefined {
    return this.models[regionKey] as Region;
  }

  public get site(): Site | undefined {
    return this.models[siteKey] as Site;
  }

  public get siteColumnName(): string {
    const hideProjects = this.config.settings.hideProjects;

    // If we are hiding projects, any sites must be points
    // If a region exists, this must be a site with a region
    // If the site is a point...
    // Otherwise its a site
    if (hideProjects || this.region || this.site?.isPoint) {
      return "Point";
    } else {
      return "Site";
    }
  }

  public updateFilters(incomingFilters: Filters<AudioRecording>): void {
    // since sorting is handled by the pagination table, when the filter is updated, it would remove the sorting order
    // to ensure that sorting is retained throughout filtering, retain the previous sorting information
    this.filters = {
      sorting: this.filters?.sorting,
      ...incomingFilters,
    };

    this.getPageData();
  }

  protected override apiAction(
    filters: Filters<AudioRecording>
  ): Observable<AudioRecording[]> {
    if (this.site) {
      filters.filter = filterModel<Site, AudioRecording>("sites", this.site, filters.filter);
    } else if (this.region) {
      filters.filter = filterModel<Region, AudioRecording>("regions", this.region, filters.filter);
    } else if (this.project) {
      filters.filter = filterModel<Project, AudioRecording>("projects", this.project, filters.filter);
    }

    return this.api.filter(filters);
  }
}

interface TableRow {
  recorded: AudioRecording;
  timezone: AudioRecording;
  duration: Duration;
  uploader: AudioRecording;
  site: AudioRecording;
  model: AudioRecording;
}

const menuItems = audioRecordingMenuItems.list;
const downloadMenuItems = audioRecordingMenuItems.batch;

function getPageInfo(subRoute: keyof typeof menuItems): IPageInfo {
  return {
    category: audioRecordingsCategory,
    pageRoute: menuItems[subRoute],
    menus: {
      actions: List([downloadMenuItems[subRoute], visualizeMenuItem]),
      actionWidgets: List([
        new WidgetMenuItem(WebsiteStatusWarningComponent, undefined, {
          message: `
            Downloading and playing audio is temporarily unavailable.
            Please try again later.
          `,
        }),
        licenseWidgetMenuItem,
      ]),
    },
    resolvers: {
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

AudioRecordingsListComponent.linkToRoute(getPageInfo("base"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("project"));

export { AudioRecordingsListComponent };
