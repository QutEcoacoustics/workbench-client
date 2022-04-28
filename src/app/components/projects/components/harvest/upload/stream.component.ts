import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { audioRecordingMenuItems } from "@components/audio-recordings/audio-recording.menus";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import filesize from "filesize";
import { endWith, Observable, startWith, timer } from "rxjs";

@Component({
  selector: "baw-harvest-stream-upload",
  template: `
    <h3>Uploading Files</h3>

    <p>You can upload to:</p>

    <p><a [href]="baseHarvestLink"> baseHarvestLink </a></p>

    <p>Rules:</p>

    <ol>
      <li>Files must be placed in the provided folders (shown below)</li>
      <li>Files must use an unambiguous format INSERT LINK</li>
      <li>
        Successfully uploaded files will no longer be visible in the SFTP
        connection - you can access them from the
        <a [strongRoute]="audioRecordings.route">{{ audioRecordings.label }}</a>
        page
      </li>
      <li>Duplicate or corrupt files will be rejected automatically</li>
    </ol>

    <p>Here are some example URLs you can use to upload your files:</p>

    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Point name</th>
          <th scope="col">Upload folder</th>
          <th scope="col">Example url</th>
        </tr>
      </thead>

      <tbody *ngIf="sites$ | withLoading | async as sites">
        <tr *ngIf="sites.loading">
          <td><span class="placeholder w-25"></span></td>
          <td><span class="placeholder w-25"></span></td>
          <td><span class="placeholder w-100"></span></td>
        </tr>

        <tr *ngFor="let site of sites.value">
          <!-- TODO Show Region name -->
          <td>{{ project.name }} / {{ site.name }}</td>
          <td>{{ site.id }}</td>
          <td>
            <a [href]="getHarvestLink(site)">{{ getHarvestLink(site) }}</a>
          </td>
        </tr>
      </tbody>
    </table>

    <h4>Current Progress</h4>

    <ul *ngIf="progress$ | async as progress">
      <li><b>Uploaded Files: </b>{{ progress }}</li>
      <li>
        <b>Uploaded Bytes: </b>{{ progressBytes(progress) }} ({{
          filesize(progressBytes(progress))
        }})
      </li>
    </ul>

    <div class="clearfix">
      <p>
        If you close this harvest you cannot reopen it and the passwords will be
        revoked permanently
      </p>
      <button class="btn btn-danger float-end" (click)="closeConnectionClick()">
        Close Connection
      </button>
    </div>
  `,
})
export class HarvestStreamUploadComponent implements OnInit {
  @Output() public stage = new EventEmitter<HarvestStage>();

  public active = 1;
  public filesize = filesize;
  public audioRecordings = audioRecordingMenuItems.list.project;
  public sites$: Observable<Site[]>;
  public project: Project;

  private intervalSpeed = 300;
  public progress$ = timer(0, this.intervalSpeed).pipe(
    startWith(0),
    endWith(100)
  );

  public constructor(
    private siteApi: SitesService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.project = retrieveResolvedModel(this.route.snapshot.data, Project);
    this.sites$ = this.siteApi.list(this.project);
  }

  public progressBytes(progress: number): number {
    // Multiply progress by random offset
    return progress * 31234321;
  }

  public get baseHarvestLink(): string {
    return "sftp://harvest:kjhgasdfkjhgasdkjfhgasdfkjhg@upload.ecosounds.qut.ecoacoustics.info:22";
  }

  public getHarvestLink(site: Site): string {
    return `${this.baseHarvestLink}/${site.id}`;
  }

  public closeConnectionClick(): void {
    this.stage.emit(HarvestStage.complete);
  }
}
