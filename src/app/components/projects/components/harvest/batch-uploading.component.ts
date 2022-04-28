import { Component, EventEmitter, Output } from "@angular/core";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import filesize from "filesize";
import { endWith, startWith, timer } from "rxjs";

@Component({
  selector: "baw-harvest-batch-uploading",
  template: `
    <h3>Uploading Files</h3>

    <ul ngbNav #nav="ngbNav" [(activeId)]="active" class="nav-tabs">
      <li [ngbNavItem]="1">
        <a ngbNavLink>Windows</a>
        <ng-template ngbNavContent>
          <ol>
            <li>
              Install <a href="https://winscp.net/eng/index.php">WinSCP</a>
            </li>
            <li>
              Click on the link below to open WinSCP and connect to our cloud
            </li>
            <li>Upload all of your files and we will check them for you</li>
          </ol>
        </ng-template>
      </li>
      <li [ngbNavItem]="2">
        <a ngbNavLink>MacOS</a>
        <ng-template ngbNavContent>
          <p>TODO: Instructions</p>
        </ng-template>
      </li>
      <li [ngbNavItem]="3">
        <a ngbNavLink>Linux</a>
        <ng-template ngbNavContent>
          <p>TODO: Instructions</p>
        </ng-template>
      </li>
    </ul>

    <div [ngbNavOutlet]="nav" class="mt-2"></div>

    <ul>
      <li>
        We have created some folders for you to put your files in already - but
        you can make your own
      </li>
      <li>
        Make sure files from each different sensor are in their own folder and
        are not mixed together
      </li>
    </ul>

    <a
      href="sftp://harvest:jhgsdfjhgsdfjhgsdfjhgsdfjhg@upload.ecosounds.qut.ecoacoustics.info:22"
    >
      sftp://harvest:jhgsdfjhgsdfjhgsdfjhgsdfjhg@upload.ecosounds.qut.ecoacoustics.info:22
    </a>

    <hr />

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
      <button class="btn btn-danger float-start" (click)="onCancel()">
        Cancel
      </button>
      <button class="btn btn-warning float-end" (click)="onFinishedUploading()">
        Upload batch
      </button>
    </div>
  `,
})
export class HarvestBatchUploadingComponent {
  @Output() public stage = new EventEmitter<HarvestStage>();

  public active = 1;
  public filesize = filesize;

  private intervalSpeed = 300;
  public progress$ = timer(0, this.intervalSpeed).pipe(
    startWith(0),
    endWith(100)
  );

  public progressBytes(progress: number): number {
    // Multiply progress by random offset
    return progress * 31234321;
  }

  public onCancel(): void {
    this.stage.emit(HarvestStage.newHarvest);
  }

  public onFinishedUploading(): void {
    this.stage.emit(HarvestStage.metadataExtraction);
  }
}
