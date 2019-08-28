import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { PermissionsShieldComponent } from "src/app/component/shared/permissions-shield/permissions-shield.component";
import { WidgetMenuItem } from "src/app/component/shared/widget/widgetItem";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import { PageComponent } from "src/app/interfaces/pageComponent";
import { Page } from "src/app/interfaces/pageDecorator";
import { AudioRecording } from "src/app/models/AudioRecording";
import { Project } from "src/app/models/Project";
import { Site } from "src/app/models/Site";
import { AudioRecordingsService } from "src/app/services/baw-api/audio-recordings.service";
import { APIError } from "src/app/services/baw-api/base-api.interceptor";
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
export class DetailsComponent extends PageComponent implements OnInit {
  project: Project;
  site: Site;
  recordings: AudioRecording[];
  startDate: Date;
  endDate: Date;
  error: number;
  errorCodes = this.sitesApi.apiReturnCodes;

  constructor(
    private route: ActivatedRoute,
    private sitesApi: SitesService,
    private projectsApi: ProjectsService,
    private audioRecordingApi: AudioRecordingsService
  ) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe({
      next: params => {
        this.projectsApi.getProject(params.projectId).subscribe({
          next: project => {
            this.project = project;
            this.error = null;
          },
          error: (err: APIError) => {
            this.error = err.code;
          }
        });

        this.sitesApi
          .getProjectSite(params.projectId, params.siteId)
          .subscribe({
            next: site => {
              this.site = site;

              this.audioRecordingApi
                .getAudioRecordings(site.id, { items: 100 })
                .subscribe({
                  next: recordings => {
                    this.recordings = recordings;
                    this.extremityDates(recordings);
                    console.debug(this.recordings);
                  }
                });
            },
            error: (err: APIError) => {
              this.error = err.code;
            }
          });
      }
    });
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

    console.debug("Start: ", startDate);
    console.debug("End: ", endDate);

    this.startDate = startDate;
    this.endDate = endDate;
  }
}
