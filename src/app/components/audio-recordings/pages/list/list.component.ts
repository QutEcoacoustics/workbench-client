import { Component, Inject, OnInit } from "@angular/core";
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
  downloadAudioRecordingMenuItem,
} from "@components/audio-recordings/audio-recording.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { API_ROOT } from "@helpers/app-initializer/app-initializer";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { PagedTableTemplate } from "@helpers/tableTemplate/pagedTableTemplate";
import { Id, Ids, toRelative } from "@interfaces/apiInterfaces";
import { MenuItem, MenuLink, MenuRoute } from "@interfaces/menusInterfaces";
import { AudioRecording, IAudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";

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
  public actions!: { play: MenuRoute; download: MenuLink; details: MenuRoute };
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
  }

  public override ngOnInit(): void {
    super.ngOnInit();

    const pageData = new PageInfo(this.route.snapshot.data);
    const menuRouteKey = Object.entries(audioRecordingMenuItems.list).find(
      (value) => pageData.route === value[1].route
    )[0];

    this.actions = {
      play: listenRecordingMenuItem,
      details: audioRecordingMenuItems.details[menuRouteKey],
      download: downloadAudioRecordingMenuItem,
    };
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

// TODO Multiple components required as a hacky bypass to #1711
@Component({
  selector: "baw-audio-recordings-site",
  templateUrl: "./list.component.html",
})
class SiteListComponent extends ListComponent {}
@Component({
  selector: "baw-audio-recordings-point",
  templateUrl: "./list.component.html",
})
class PointListComponent extends ListComponent {}
@Component({
  selector: "baw-audio-recordings-region",
  templateUrl: "./list.component.html",
})
class RegionListComponent extends ListComponent {}
@Component({
  selector: "baw-audio-recordings-regions",
  templateUrl: "./list.component.html",
})
class RegionsListComponent extends ListComponent {}
@Component({
  selector: "baw-audio-recordings-project",
  templateUrl: "./list.component.html",
})
class ProjectListComponent extends ListComponent {}
@Component({
  selector: "baw-audio-recordings-projects",
  templateUrl: "./list.component.html",
})
class ProjectsListComponent extends ListComponent {}

function linkData(component: PageComponent, menuItem: MenuItem): void {
  component
    .linkComponentToPageInfo({
      category: audioRecordingsCategory,
      menus: { actions: List([batchDownloadAudioRecordingMenuItem]) },
      resolvers: {
        [projectKey]: projectResolvers.showOptional,
        [regionKey]: regionResolvers.showOptional,
        [siteKey]: siteResolvers.showOptional,
      },
    })
    .andMenuRoute(menuItem);
}

const menuItems = audioRecordingMenuItems.list;
linkData(ListComponent, menuItems.base);
linkData(SiteListComponent, menuItems.site);
linkData(PointListComponent, menuItems.point);
linkData(RegionListComponent, menuItems.region);
linkData(RegionsListComponent, menuItems.regions);
linkData(ProjectListComponent, menuItems.project);
linkData(ProjectsListComponent, menuItems.projects);

export {
  ListComponent,
  SiteListComponent,
  PointListComponent,
  RegionListComponent,
  RegionsListComponent,
  ProjectListComponent,
  ProjectsListComponent,
};
