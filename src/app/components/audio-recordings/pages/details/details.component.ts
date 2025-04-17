import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { audioRecordingResolvers } from "@baw-api/audio-recording/audio-recordings.service";
import { projectResolvers } from "@baw-api/project/projects.service";
import { regionResolvers } from "@baw-api/region/regions.service";
import {
  hasResolvedSuccessfully,
  retrieveResolvers,
} from "@baw-api/resolvers/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import {
  audioRecordingMenuItems,
  audioRecordingsCategory,
  downloadAudioRecordingAnalysesMenuItem,
  downloadAudioRecordingMenuItem,
} from "@components/audio-recordings/audio-recording.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo } from "@helpers/page/pageInfo";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { List } from "immutable";
import { WidgetMenuItem } from "@menu/widgetItem";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
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
  standalone: false,
})
class AudioRecordingsDetailsComponent extends PageComponent implements OnInit {
  public fields = schema.fields;
  public failure: boolean;

  public recording?: AudioRecording;
  public project?: Project;
  public region?: Region;
  public site?: Site;

  public constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit(): void {
    const models = retrieveResolvers(this.route.snapshot.data);
    if (!hasResolvedSuccessfully(models)) {
      this.failure = true;
      return;
    }

    this.recording = this.models[audioRecordingKey] as AudioRecording;
    this.project = this.models[projectKey] as Project;
    this.region = this.models[regionKey] as Region;
    this.site = this.models[siteKey] as Site;
  }
}

function getPageInfo(
  subRoute: keyof typeof audioRecordingMenuItems.details
): IPageInfo {
  return {
    pageRoute: audioRecordingMenuItems.details[subRoute],
    category: audioRecordingsCategory,
    menus: {
      actions: List([
        downloadAudioRecordingMenuItem,
        downloadAudioRecordingAnalysesMenuItem,
      ]),
      actionWidgets: List([
        new WidgetMenuItem(WebsiteStatusWarningComponent, undefined, {
          message: `
            Downloading audio is temporarily unavailable.
            Please try again later.
          `,
        }),
      ]),
    },
    resolvers: {
      [audioRecordingKey]: audioRecordingResolvers.show,
      [projectKey]: projectResolvers.showOptional,
      [regionKey]: regionResolvers.showOptional,
      [siteKey]: siteResolvers.showOptional,
    },
  };
}

AudioRecordingsDetailsComponent.linkToRoute(getPageInfo("base"))
  .linkToRoute(getPageInfo("site"))
  .linkToRoute(getPageInfo("siteAndRegion"))
  .linkToRoute(getPageInfo("region"))
  .linkToRoute(getPageInfo("project"));

export { AudioRecordingsDetailsComponent };
