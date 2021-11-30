import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { Filters } from "@baw-api/baw-api.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  audioRecordingsCategory,
  audioRecordingsMenuItem,
} from "@components/audio-recordings/audio-recording.menus";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id, Ids, toRelative } from "@interfaces/apiInterfaces";
import { AudioRecording, IAudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";

const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-audio-recordings",
  templateUrl: "./list.component.html",
})
class ListComponent
  extends PagedTableTemplate<TableRow, AudioRecording>
  implements OnInit
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

  public constructor(api: AudioRecordingsService, route: ActivatedRoute) {
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

ListComponent.linkComponentToPageInfo({
  category: audioRecordingsCategory,
  resolvers: {
    [projectKey]: projectResolvers.showOptional,
    [regionKey]: regionResolvers.showOptional,
    [siteKey]: siteResolvers.showOptional,
  },
}).andMenuRoute(audioRecordingsMenuItem);

export { ListComponent };

interface TableRow {
  recorded: string;
  timezone: AudioRecording;
  duration: string;
  uploader: AudioRecording;
  site: AudioRecording;
  model: AudioRecording;
}
