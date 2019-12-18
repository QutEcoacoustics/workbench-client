import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { Subject } from "rxjs";
import { flatMap, takeUntil } from "rxjs/operators";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
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
  private unsubscribe = new Subject();
  endDate: Date;
  loadingProgress = 0;
  project: Project;
  recordings: AudioRecording[];
  site: Site;
  startDate: Date;
  error: APIErrorDetails;
  state = "loading";

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
    this.route.params
      .pipe(
        flatMap(params => {
          return this.projectsApi.getProject(params.projectId);
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
        (err: APIErrorDetails) => {
          this.error = err;
          this.state = "error";
        }
      );

    // Retrieve site and audio recording details
    this.route.params
      .pipe(
        flatMap(params => {
          return this.sitesApi.getProjectSite(params.projectId, params.siteId);
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
        (err: APIErrorDetails) => {
          // Let project error dominate
          if (this.state !== "error") {
            this.error = err;
            this.state = "error";
          }
        }
      );

    // Retrieve audio recording details
    this.route.params
      .pipe(
        flatMap(params => {
          return this.audioRecordingApi.getAudioRecordings(params.siteId, {
            items: 100
          });
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        recordings => {
          this.recordings = recordings;
          this.extremityDates(recordings);
        },
        () => {
          // Doesn't break things if audio recordings don't load
          this.recordings = [];
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
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
