import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { flatMap } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { SubSink } from "src/app/helpers/subsink/subsink";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { AudioRecording } from "src/app/models/AudioRecording";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { APIErrorDetails } from "src/app/services/baw-api/api.interceptor";
import { AudioRecordingsService } from "src/app/services/baw-api/audio-recordings.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { SitesService } from "src/app/services/baw-api/sites.service";
import {
  editSiteMenuItem,
  siteMenuItem,
  sitesCategory
} from "../../sites.menus";

@Page({
  category: sitesCategory,
  menus: {
    actions: List<AnyMenuItem>([editSiteMenuItem]),
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
export class DetailsComponent extends PageComponent
  implements OnInit, OnDestroy {
  endDate: Date;
  loadingProgress = 0;
  project: Project;
  recordings: AudioRecording[];
  site: Site;
  startDate: Date;
  state = "loading";
  subSink: SubSink = new SubSink();

  constructor(
    private route: ActivatedRoute,
    private sitesApi: SitesService,
    private projectsApi: ProjectsService,
    private audioRecordingApi: AudioRecordingsService
  ) {
    super();
  }

  ngOnInit() {
    const allRequiredDataLoaded = 2;

    // Retrieve project details
    this.subSink.sink = this.route.params
      .pipe(
        flatMap(params => {
          return this.projectsApi.getProject(params.projectId);
        })
      )
      .subscribe(
        project => {
          this.project = project;

          this.loadingProgress++;
          if (this.loadingProgress === allRequiredDataLoaded) {
            this.state = "ready";
          }
        },
        (err: APIErrorDetails) => {
          if (err.status === this.sitesApi.apiReturnCodes.unauthorized) {
            this.state = "unauthorized";
          } else {
            this.state = "notFound";
          }
        }
      );

    // Retrieve site and audio recording details
    this.subSink.sink = this.route.params
      .pipe(
        flatMap(params => {
          return this.sitesApi.getProjectSite(params.projectId, params.siteId);
        })
      )
      .subscribe(
        site => {
          this.site = site;

          this.loadingProgress++;
          if (this.loadingProgress === allRequiredDataLoaded) {
            this.state = "ready";
          }
        },
        (err: APIErrorDetails) => {
          if (err.status === this.sitesApi.apiReturnCodes.unauthorized) {
            this.state = "unauthorized";
          } else {
            this.state = "notFound";
          }
        }
      );

    // Retrieve audio recording details
    this.subSink.sink = this.route.params
      .pipe(
        flatMap(params => {
          return this.audioRecordingApi.getAudioRecordings(params.siteId, {
            items: 100
          });
        })
      )
      .subscribe(
        recordings => {
          this.recordings = recordings;
          this.extremityDates(recordings);
        },
        (err: APIErrorDetails) => {
          if (err.status === this.sitesApi.apiReturnCodes.unauthorized) {
            this.state = "unauthorized";
          } else {
            this.state = "notFound";
          }
        }
      );
  }

  extremityDates(recordings: AudioRecording[]) {
    let startDate: Date = null;
    let endDate: Date = null;

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

  ngOnDestroy() {
    this.subSink.unsubscribe();
  }
}
