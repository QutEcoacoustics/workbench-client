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
  audioRecordingMenuItem,
  audioRecordingsCategory,
} from "@components/audio-recordings/audio-recording.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { PageInfo } from "@helpers/page/pageInfo";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";

const audioRecordingKey = "audioRecording";
const projectKey = "project";
const regionKey = "region";
const siteKey = "site";

@Component({
  selector: "baw-audio-recording",
  templateUrl: "./details.component.html",
})
class DetailsComponent extends PageComponent implements OnInit {
  public failure: boolean;
  private models: ResolvedModelList;

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

DetailsComponent.linkComponentToPageInfo({
  category: audioRecordingsCategory,
  resolvers: {
    [audioRecordingKey]: audioRecordingResolvers.show,
    [projectKey]: projectResolvers.showOptional,
    [regionKey]: regionResolvers.showOptional,
    [siteKey]: siteResolvers.showOptional,
  },
}).andMenuRoute(audioRecordingMenuItem);

export { DetailsComponent };
