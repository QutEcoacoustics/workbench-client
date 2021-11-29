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
import { DateTime } from "luxon";

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
            site: recording,
            recorded: recording.recordedDate.toLocaleString(
              DateTime.DATETIME_SHORT
            ),
            duration: toRelative(recording.duration, { largest: 1 }),
            model: recording,
          })
        ),
      route
    );
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
    function filterSites(sites: Ids | Id) {
      const siteFilter = (((filters ??= {}).filter ??= {}).siteId ??= {});
      if (sites instanceof Set) {
        siteFilter.in = Array.from(sites);
      } else {
        siteFilter.eq = sites;
      }
    }

    // Order matters
    if (this.site) {
      filterSites(this.site.id);
    } else if (this.region) {
      filterSites(this.region.siteIds);
    } else if (this.project) {
      filterSites(this.project.siteIds);
    }

    return this.api.filter(filters);
  }
}

// TODO Link to multiple menu routes
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
  duration: string;
  uploader: AudioRecording;
  site: AudioRecording;
  model: AudioRecording;
}
