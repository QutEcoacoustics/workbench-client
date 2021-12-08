import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import {
  hasResolvedSuccessfully,
  ResolvedModelList,
  retrieveResolvers,
} from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  audioRecordingsCategory,
  audioRecordingMenuItems,
  downloadAudioRecordingMenuItem,
} from "@components/audio-recordings/audio-recording.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { MenuItem } from "@interfaces/menusInterfaces";
import { PermissionsShieldComponent } from "@menu/permissions-shield.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import schema from "./audio-recording.schema.json";

const audioRecordingKey = "audioRecording";
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

/**
 * Details of a special audio recording. This component can be accessed from:
 * /audio_recordings/:audioRecordingId
 */
@Component({
  selector: "baw-audio-recording",
  templateUrl: "./details.component.html",
})
class AudioRecordingsDetailsComponent extends PageComponent implements OnInit {
  public failure: boolean;
  private models: ResolvedModelList;
  public fields = schema.fields;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data as PageInfo);
    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }
    this.models = models;
  }

  public get recording(): AudioRecording | undefined {
    return this.models[audioRecordingKey] as AudioRecording;
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
}

// TODO Multiple components required as a hacky bypass to #1711

/**
 * SiteDetailsComponent, this handles the details page for audio recording when
 * accessed from a site page. This component can be accessed from:
 * /project/:projectId/site/:siteId/audio_recordings/:audioRecordingId
 */
@Component({
  selector: "baw-audio-recording-site",
  templateUrl: "./details.component.html",
})
class AudioRecordingsDetailsFilteredBySiteComponent extends AudioRecordingsDetailsComponent {}

/**
 * PointDetailsComponent, this handles the details page for audio recordings when
 * accessed from a point. This component can be accessed from:
 * /project/:projectId/region/:regionId/site/:siteId/audio_recordings/:audioRecordingId
 */
@Component({
  selector: "baw-audio-recording-point",
  templateUrl: "./details.component.html",
})
class AudioRecordingsDetailsFilteredBySiteAndRegionComponent extends AudioRecordingsDetailsComponent {}

/**
 * RegionDetailsComponent, this handles the details page for audio recordings when
 * access from a region page. This component can be accessed from:
 * /project/:projectId/region/:regionId/audio_recordings/:audioRecordingId
 */
@Component({
  selector: "baw-audio-recording-region",
  templateUrl: "./details.component.html",
})
class AudioRecordingsDetailsFilteredByRegionComponent extends AudioRecordingsDetailsComponent {}

/**
 * ProjectDetailsComponent, this handles the details page for audio recordings when
 * access from a project page. This component can be accessed from:
 * /project/:projectId/audio_recordings/:audioRecordingId
 */
@Component({
  selector: "baw-audio-recording-project",
  templateUrl: "./details.component.html",
})
class AudioRecordingsDetailsFilteredByProjectComponent extends AudioRecordingsDetailsComponent {}

/** Link components with their menu item, and assign page info which is shared between all */
function linkData(component: PageComponent, menuItem: MenuItem): void {
  component.linkToRouterWith(
    {
      category: audioRecordingsCategory,
      menus: {
        actions: List([
          listenRecordingMenuItem,
          downloadAudioRecordingMenuItem,
        ]),
        actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
      },
      resolvers: {
        [audioRecordingKey]: audioRecordingResolvers.show,
        [projectKey]: projectResolvers.showOptional,
        [regionKey]: regionResolvers.showOptional,
        [siteKey]: siteResolvers.showOptional,
      },
    },
    menuItem
  );
}

const menuItems = audioRecordingMenuItems.details;
linkData(AudioRecordingsDetailsComponent, menuItems.base);
linkData(AudioRecordingsDetailsFilteredBySiteComponent, menuItems.site);
linkData(
  AudioRecordingsDetailsFilteredBySiteAndRegionComponent,
  menuItems.siteAndRegion
);
linkData(AudioRecordingsDetailsFilteredByRegionComponent, menuItems.region);
linkData(AudioRecordingsDetailsFilteredByProjectComponent, menuItems.project);

export {
  AudioRecordingsDetailsComponent,
  AudioRecordingsDetailsFilteredBySiteComponent,
  AudioRecordingsDetailsFilteredBySiteAndRegionComponent,
  AudioRecordingsDetailsFilteredByRegionComponent,
  AudioRecordingsDetailsFilteredByProjectComponent,
};
