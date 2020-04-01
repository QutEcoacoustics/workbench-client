import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import filesize from "filesize";
import { List } from "immutable";
import _ from "lodash";
import { catchError, map, takeUntil } from "rxjs/operators";
import { ListDetail } from "src/app/component/shared/question-answer/question-answer.component";
import { isUninitialized } from "src/app/helpers";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AudioRecording } from "src/app/models/AudioRecording";
import { AccountService } from "src/app/services/baw-api/account.service";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { audioRecordingResolvers } from "src/app/services/baw-api/audio-recording.service";
import { apiReturnCodes } from "src/app/services/baw-api/baw-api.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { verifyResolvers } from "src/app/services/baw-api/resolver-common";
import { ShallowSitesService } from "src/app/services/baw-api/sites.service";
import {
  adminAudioRecordingCategory,
  adminAudioRecordingMenuItem,
  adminAudioRecordingsMenuItem
} from "../../admin.menus";
import { fields } from "./audioRecording.json";

const audioRecordingKey = "audioRecording";

@Page({
  category: adminAudioRecordingCategory,
  menus: {
    links: List(),
    actions: List([adminAudioRecordingsMenuItem, adminAudioRecordingMenuItem])
  },
  resolvers: {
    [audioRecordingKey]: audioRecordingResolvers.show
  },
  self: adminAudioRecordingMenuItem
})
@Component({
  selector: "app-admin-audio-recording",
  template: `
    <div *ngIf="!failure">
      <!-- TODO *ngIf="!error" -->
      <div>
        <h1>Audio Recording Details</h1>
        <app-question-answer
          [details]="details.toArray()"
        ></app-question-answer>
      </div>
      <app-error-handler [error]="error"></app-error-handler>
    </div>
  `
})
export class AdminAudioRecordingComponent extends WithUnsubscribe(PageComponent)
  implements OnInit {
  public audioRecording: AudioRecording;
  public details: List<ListDetail> = List([]);
  public error: ApiErrorDetails;
  public failure: boolean;
  public fields = fields;

  constructor(
    private accountsApi: AccountService,
    private sitesApi: ShallowSitesService,
    private projectsApi: ProjectsService,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    const data = this.route.snapshot.data;
    if (!verifyResolvers(data)) {
      this.failure = true;
    }
    this.audioRecording = data[audioRecordingKey].model;

    const keys = [
      "id",
      "uuid",
      "uploader",
      "recordedDate",
      "sites",
      "durationSeconds",
      "sampleRateHertz",
      "channels",
      "mediaType",
      "dataLengthBytes",
      "fileHash",
      "status",
      "notes",
      "creator",
      "updater",
      "deleter",
      "createdAt",
      "updatedAt",
      "originalFileName",
      "recordedUtcOffset",
      "projects",
      "annotations"
    ];

    keys.forEach(key => {
      this.details = this.details.push({
        label: _.startCase(key),
        value: this.audioRecording[key]
      });
    });

    const dataLengthBytes = 9;
    const sitesIndex = 4;
    const projectsIndex = 20;
    const creatorIndex = 13;
    const updaterIndex = 14;
    const deleterIndex = 15;

    //
    this.details.get(dataLengthBytes).value = filesize(
      this.audioRecording.dataLengthBytes
    );

    // Retrieve models
    this.retrieveUser(this.audioRecording.creatorId, creatorIndex);
    this.retrieveUser(this.audioRecording.updaterId, updaterIndex);
    this.retrieveUser(this.audioRecording.deleterId, deleterIndex);
    this.retrieveSite(this.audioRecording.siteId, sitesIndex);
    this.retrieveProjects(this.audioRecording.siteId, projectsIndex);
  }

  /**
   * Create observable which outputs site
   * @param siteId Site ID
   * @param index Key index
   */
  private retrieveSite(siteId: Id, index: number) {
    if (isUninitialized(siteId)) {
      return;
    }

    this.details.get(index).value = this.sitesApi
      .show(this.audioRecording.siteId)
      .pipe(
        map(site => {
          return {
            value: `${site.name} (${site.id})`
          };
        }),
        catchError(() => {
          return [{ value: "Unknown Site (" + siteId + ")" }];
        }),
        takeUntil(this.unsubscribe)
      );
  }

  /**
   * Create observable which outputs list of projects
   * @param siteId Site ID
   * @param index Key index
   */
  private retrieveProjects(siteId: Id, index: number) {
    if (isUninitialized(siteId)) {
      return;
    }

    this.details.get(index).value = this.projectsApi
      .filter({
        sorting: { orderBy: "id", direction: "asc" },
        filter: { "sites.id": { in: [1] } }
      })
      .pipe(
        map(projects => {
          return {
            value: projects.map(project => ({
              value: `${project.name} (${project.id})`,
              route: project.redirectPath()
            }))
          };
        }),
        catchError((err: ApiErrorDetails) => {
          this.error = err;
          return [{ value: undefined }];
        }),
        takeUntil(this.unsubscribe)
      );
  }

  /**
   * Create observable which outputs account details
   * @param accountId Account ID
   * @param index Key index
   */
  private retrieveUser(accountId: Id, index: number) {
    if (isUninitialized(accountId)) {
      return;
    }

    this.details.get(index).value = this.accountsApi.show(accountId).pipe(
      map(account => {
        return {
          value: `${account.userName} (${account.id})`,
          route: account.redirectPath()
        };
      }),
      catchError((err: ApiErrorDetails) => {
        if (err.status === apiReturnCodes.notFound) {
          return [{ value: "Deleted User (" + accountId + ")" }];
        } else {
          return [{ value: "Unknown User (" + accountId + ")" }];
        }
      }),
      takeUntil(this.unsubscribe)
    );
  }
}
