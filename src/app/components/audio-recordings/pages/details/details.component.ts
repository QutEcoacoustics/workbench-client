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
  downloadAudioRecordingMenuItem,
  pointAudioRecordingMenuItem,
  siteAudioRecordingMenuItem,
} from "@components/audio-recordings/audio-recording.menus";
import { listenRecordingMenuItem } from "@components/listen/listen.menus";
import { PageComponent } from "@helpers/page/pageComponent";
import { IPageInfo, PageInfo } from "@helpers/page/pageInfo";
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

@Component({
  selector: "baw-audio-recording",
  templateUrl: "./details.component.html",
})
class DetailsComponent extends PageComponent implements OnInit {
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

@Component({
  selector: "baw-audio-recording-site",
  templateUrl: "./details.component.html",
})
class SiteDetailsComponent extends DetailsComponent {}

@Component({
  selector: "baw-audio-recording-point",
  templateUrl: "./details.component.html",
})
class PointDetailsComponent extends DetailsComponent {}

const pageInfo: IPageInfo = {
  category: audioRecordingsCategory,
  menus: {
    actions: List([listenRecordingMenuItem, downloadAudioRecordingMenuItem]),
    actionWidgets: List([new WidgetMenuItem(PermissionsShieldComponent)]),
  },
  resolvers: {
    [audioRecordingKey]: audioRecordingResolvers.show,
    [projectKey]: projectResolvers.showOptional,
    [regionKey]: regionResolvers.showOptional,
    [siteKey]: siteResolvers.showOptional,
  },
};

DetailsComponent.linkComponentToPageInfo(pageInfo).andMenuRoute(
  audioRecordingMenuItem
);
SiteDetailsComponent.linkComponentToPageInfo(pageInfo).andMenuRoute(
  siteAudioRecordingMenuItem
);
PointDetailsComponent.linkComponentToPageInfo(pageInfo).andMenuRoute(
  pointAudioRecordingMenuItem
);

export { DetailsComponent, SiteDetailsComponent, PointDetailsComponent };
