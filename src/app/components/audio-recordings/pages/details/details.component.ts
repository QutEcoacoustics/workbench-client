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

const selectorBase = "baw-audio-recording" as const;
const templateUrl = "./details.component.html" as const;

@Component({ selector: selectorBase, templateUrl })
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

// TODO Multiple components required as a hacky bypass to #1711
@Component({ selector: selectorBase + "-site", templateUrl })
class SiteDetailsComponent extends DetailsComponent {}
@Component({ selector: selectorBase + "-point", templateUrl })
class PointDetailsComponent extends DetailsComponent {}
@Component({ selector: selectorBase + "-region", templateUrl })
class RegionDetailsComponent extends DetailsComponent {}
@Component({ selector: selectorBase + "-regions", templateUrl })
class RegionsDetailsComponent extends DetailsComponent {}
@Component({ selector: selectorBase + "-project", templateUrl })
class ProjectDetailsComponent extends DetailsComponent {}
@Component({ selector: selectorBase + "-projects", templateUrl })
class ProjectsDetailsComponent extends DetailsComponent {}

function linkData(component: PageComponent, menuItem: MenuItem): void {
  component
    .linkComponentToPageInfo({
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
    })
    .andMenuRoute(menuItem);
}

const menuItems = audioRecordingMenuItems.details;
linkData(DetailsComponent, menuItems.base);
linkData(SiteDetailsComponent, menuItems.site);
linkData(PointDetailsComponent, menuItems.point);
linkData(RegionDetailsComponent, menuItems.region);
linkData(RegionsDetailsComponent, menuItems.regions);
linkData(ProjectDetailsComponent, menuItems.project);
linkData(ProjectsDetailsComponent, menuItems.projects);

export {
  DetailsComponent,
  SiteDetailsComponent,
  PointDetailsComponent,
  RegionDetailsComponent,
  RegionsDetailsComponent,
  ProjectDetailsComponent,
  ProjectsDetailsComponent,
};
