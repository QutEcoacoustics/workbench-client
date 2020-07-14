import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { siteResolvers } from "@baw-api/site/sites.service";
import { List } from "immutable";
import { projectMenuItem } from "src/app/component/projects/projects.menus";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { exploreAudioMenuItem } from "src/app/helpers/page/externalMenus";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { DateTimeTimezone } from "src/app/interfaces/apiInterfaces";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { AudioRecording } from "src/app/models/AudioRecording";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { ResolvedModel } from "src/app/services/baw-api/resolver-common";
import {
  deleteSiteMenuItem,
  editSiteMenuItem,
  harvestMenuItem,
  siteAnnotationsMenuItem,
  siteMenuItem,
  sitesCategory,
} from "../../sites.menus";

export const siteMenuItemActions = [
  exploreAudioMenuItem,
  siteAnnotationsMenuItem,
  editSiteMenuItem,
  harvestMenuItem,
  deleteSiteMenuItem,
];

const projectKey = "project";
const siteKey = "site";

/**
 * Site Details Component
 */
@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List(),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
  self: siteMenuItem,
})
@Component({
  selector: "app-sites-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent extends PageComponent implements OnInit {
  public project: Project;
  public recordings: AudioRecording[];
  public recordingsEnd: DateTimeTimezone;
  public recordingsStart: DateTimeTimezone;
  public site: Site;

  constructor(private route: ActivatedRoute) {
    super();
  }

  public ngOnInit() {
    const projectModel: ResolvedModel<Project> = this.route.snapshot.data[
      projectKey
    ];
    const siteModel: ResolvedModel<Site> = this.route.snapshot.data[siteKey];

    if (projectModel.error || siteModel.error) {
      return;
    }

    this.project = projectModel.model;
    this.site = siteModel.model;
    this.recordings = [];

    // Retrieve audio recording details
    // this.route.params
    //   .pipe(
    //     flatMap(params => {
    //       return this.audioRecordingApi.getAudioRecordings(params.siteId, {
    //         items: 100
    //       });
    //     }),
    //     takeUntil(this.unsubscribe)
    //   )
    //   .subscribe(
    //     recordings => {
    //       this.recordings = recordings;
    //       this.extremityDates(recordings);
    //     },
    //     () => {
    //       // Doesn't break things if audio recordings don't load
    //       this.recordings = [];
    //     }
    //   );
  }

  public extremityDates(recordings: AudioRecording[]) {
    let startDate: DateTimeTimezone = null;
    let endDate: DateTimeTimezone = null;

    recordings.map((recording) => {
      if (!startDate || recording.recordedDate < startDate) {
        startDate = recording.recordedDate;
      }
      if (!endDate || recording.recordedDate > endDate) {
        endDate = recording.recordedDate;
      }
    });

    this.recordingsStart = startDate;
    this.recordingsEnd = endDate;
  }
}
