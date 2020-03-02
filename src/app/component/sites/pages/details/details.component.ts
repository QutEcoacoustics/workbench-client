import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap, takeUntil } from "rxjs/operators";
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
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  annotationsMenuItem,
  deleteSiteMenuItem,
  editSiteMenuItem,
  harvestMenuItem,
  siteMenuItem,
  sitesCategory
} from "../../sites.menus";

export const siteMenuItemActions = [
  exploreAudioMenuItem,
  annotationsMenuItem,
  editSiteMenuItem,
  harvestMenuItem,
  deleteSiteMenuItem
];

@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>(siteMenuItemActions),
    actionsWidget: new WidgetMenuItem(PermissionsShieldComponent, {}),
    links: List()
  },
  self: siteMenuItem
})
@Component({
  selector: "app-sites-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"]
})
export class DetailsComponent extends PageComponent implements OnInit {
  endDate: DateTimeTimezone;
  loadingProgress = 0;
  project: Project;
  recordings: AudioRecording[];
  site: Site;
  startDate: DateTimeTimezone;
  error: ApiErrorDetails;
  state = "loading";

  constructor(
    private route: ActivatedRoute,
    private sitesApi: SitesService,
    private projectsApi: ProjectsService
  ) {
    super();
  }

  ngOnInit() {
    const allRequiredDataLoaded = 2;

    // Retrieve project details
    this.route.params
      .pipe(
        flatMap(params => {
          return this.projectsApi.show(params.projectId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        project => {
          this.project = project;

          this.loadingProgress++;
          if (this.loadingProgress === allRequiredDataLoaded) {
            this.state = "ready";
          }
        },
        (err: ApiErrorDetails) => {
          this.error = err;
          this.state = "error";
        }
      );

    // Retrieve site and audio recording details
    this.route.params
      .pipe(
        flatMap(params => {
          return this.sitesApi.show(params.projectId, params.siteId);
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        site => {
          this.site = site;

          this.loadingProgress++;
          if (this.loadingProgress === allRequiredDataLoaded) {
            this.state = "ready";
          }
        },
        (err: ApiErrorDetails) => {
          // Let project error dominate
          if (this.state !== "error") {
            this.error = err;
            this.state = "error";
          }
        }
      );

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

  extremityDates(recordings: AudioRecording[]) {
    let startDate: DateTimeTimezone = null;
    let endDate: DateTimeTimezone = null;

    recordings.map(recording => {
      if (!startDate || recording.recordedDate < startDate) {
        startDate = recording.recordedDate;
      }
      if (!endDate || recording.recordedDate > endDate) {
        endDate = recording.recordedDate;
      }
    });

    this.startDate = startDate;
    this.endDate = endDate;
  }
}
