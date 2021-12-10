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
  batchDownloadAudioRecordingMenuItem,
} from "@components/audio-recordings/audio-recording.menus";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { IPageInfo } from "@helpers/page/pageInfo";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id, Ids, toRelative } from "@interfaces/apiInterfaces";
import { AudioRecording, IAudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";

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
  protected api: AudioRecordingsService;

  public constructor(
    @Inject(API_ROOT) public apiRoot: string,
    api: AudioRecordingsService,
    route: ActivatedRoute
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
            recorded: recording.recordedDate.toFormat("yyyy-LL-dd HH:mm"),
            duration: toRelative(recording.duration, { largest: 1 }),
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

  protected apiAction(filters: Filters<IAudioRecording>) {
    function updateFilterWithSite(sites: Ids | Id) {
      const siteFilter = (((filters ??= {}).filter ??= {}).siteId ??= {});
      if (sites instanceof Set) {
        siteFilter.in = Array.from(sites);
      } else {
        siteFilter.eq = sites;
      }
    }

    // Order matters
    if (this.site) {
      updateFilterWithSite(this.site.id);
    } else if (this.region) {
      updateFilterWithSite(this.region.siteIds);
    } else if (this.project) {
      updateFilterWithSite(this.project.siteIds);
    }

    return this.api.filter(filters);
  }
}

interface TableRow {
  recorded: string;
  timezone: AudioRecording;
  duration: string;
  uploader: AudioRecording;
  site: AudioRecording;
  model: AudioRecording;
}

const menuItems = audioRecordingMenuItems.list;
const pageInfo: IPageInfo = {
  category: audioRecordingsCategory,
  menus: { actions: List([batchDownloadAudioRecordingMenuItem]) },
  resolvers: {
    [projectKey]: projectResolvers.showOptional,
    [regionKey]: regionResolvers.showOptional,
    [siteKey]: siteResolvers.showOptional,
  },
};

AudioRecordingsListComponent.linkToRoute({
  ...pageInfo,
  pageRoute: menuItems.base,
})
  .linkToRoute({ ...pageInfo, pageRoute: menuItems.site })
  .linkToRoute({ ...pageInfo, pageRoute: menuItems.siteAndRegion })
  .linkToRoute({ ...pageInfo, pageRoute: menuItems.region })
  .linkToRoute({ ...pageInfo, pageRoute: menuItems.project });

export { AudioRecordingsListComponent };
