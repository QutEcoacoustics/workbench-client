import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";
import { ListDetail } from "src/app/component/shared/question-answer/question-answer.component";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AudioRecording } from "src/app/models/AudioRecording";
import { audioRecordingResolvers } from "src/app/services/baw-api/audio-recording.service";
import { verifyResolvers } from "src/app/services/baw-api/resolver-common";
import {
  adminAudioRecordingCategory,
  adminAudioRecordingMenuItem,
  adminAudioRecordingsMenuItem
} from "../../admin.menus";
import { fields } from "./audioRecording.json";
import _ from "lodash";
import { ApiErrorDetails } from "src/app/services/baw-api/api.interceptor.service";
import { Id } from "src/app/interfaces/apiInterfaces";
import { AccountService } from "src/app/services/baw-api/account.service";
import {
  SitesService,
  ShallowSitesService
} from "src/app/services/baw-api/sites.service";
import { ProjectsService } from "src/app/services/baw-api/projects.service";
import { WithUnsubscribe } from "src/app/helpers/unsubscribe/unsubscribe";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { takeUntil, flatMap } from "rxjs/operators";
import { isUninitialized } from "src/app/app.helper";
import { Site } from "src/app/models/Site";

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
        value: this.audioRecording[key],
        loading: false
      });
    });

    const sitesIndex = 4;
    const projectsIndex = 20;
    const creatorIndex = 13;
    const updaterIndex = 14;
    const deleterIndex = 15;

    // Retrieve users
    this.retrieveUser(this.audioRecording.creatorId, creatorIndex);
    this.retrieveUser(this.audioRecording.updaterId, updaterIndex);
    this.retrieveUser(this.audioRecording.deleterId, deleterIndex);

    const siteDetails = this.setLoading(sitesIndex);
    const projectDetails = this.setLoading(projectsIndex);
    let site: Site;

    this.sitesApi
      .show(this.audioRecording.siteId)
      .pipe(
        flatMap(model => {
          site = model;
          siteDetails.value = `${site.name} (${site.id})`;
          this.details = this.details.set(sitesIndex, siteDetails);
          return this.projectsApi.filter({
            filter: { siteIds: { in: [this.audioRecording.siteId] } }
          });
        }),
        takeUntil(this.unsubscribe)
      )
      .subscribe(
        projects => {
          projectDetails.value = projects.map(project => ({
            value: `${project.name} (${project.id})`,
            route: project.redirectPath()
          }));
          projectDetails.loading = false;
          this.details = this.details.set(projectsIndex, projectDetails);
        },
        (err: ApiErrorDetails) => {
          this.error = err;
        }
      );
  }

  /**
   * Retrieve account data and update details page
   * @param accountId Account ID
   * @param index Key index
   */
  private retrieveUser(accountId: Id, index: number) {
    if (isUninitialized(accountId)) {
      return undefined;
    }

    const detail = this.setLoading(index);

    this.accountsApi
      .show(accountId)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(
        account => {
          detail.value = `${account.userName} (${account.id})`;
          detail.loading = false;
          detail.route = account.redirectPath();
          this.details = this.details.set(index, detail);
        },
        () => {
          // User details are accessible to any logged in users so this must
          // be a ghost user
          detail.value = `Unknown (${accountId})`;
          detail.loading = false;
          this.details = this.details.set(index, detail);
        }
      );
  }

  private setLoading(index: number) {
    const detail = this.details.get(index);
    detail.loading = true;
    this.details = this.details.set(index, detail);
    return detail;
  }
}
