import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { projectResolvers } from "@baw-api/project/projects.service";
import { ResolvedModel } from "@baw-api/resolver-common";
import { siteResolvers } from "@baw-api/site/sites.service";
import { projectMenuItem } from "@components/projects/projects.menus";
import { PermissionsShieldComponent } from "@components/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "@components/shared/widget/widgetItem";
import { exploreAudioMenuItem } from "@helpers/page/externalMenus";
import { PageComponent } from "@helpers/page/pageComponent";
import { DateTimeTimezone } from "@interfaces/apiInterfaces";
import { AnyMenuItem } from "@interfaces/menusInterfaces";
import { AudioRecording } from "@models/AudioRecording";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { MapMarkerOption, sanitizeMapMarkers } from "@shared/map/map.component";
import { List } from "immutable";
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
@Component({
  selector: "app-sites-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
class DetailsComponent extends PageComponent implements OnInit {
  public project: Project;
  public recordings: AudioRecording[];
  public recordingsEnd: DateTimeTimezone;
  public recordingsStart: DateTimeTimezone;
  public site: Site;
  public marker: MapMarkerOption[];

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
    this.marker = sanitizeMapMarkers(this.site.getMapMarker());

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

DetailsComponent.LinkComponentToPageInfo({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([projectMenuItem, ...siteMenuItemActions]),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
  },
  resolvers: {
    [projectKey]: projectResolvers.show,
    [siteKey]: siteResolvers.show,
  },
}).AndMenuRoute(siteMenuItem);

export { DetailsComponent };
