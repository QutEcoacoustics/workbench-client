import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestStatus } from "@models/Harvest";

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
              Install
              <a target="_blank" href="https://winscp.net/eng/index.php">
                WinSCP
              </a>
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
          <baw-wip>
            <p>TODO: Instructions</p>
          </baw-wip>
        </ng-template>
      </li>
      <li [ngbNavItem]="3">
        <a ngbNavLink>Linux</a>
        <ng-template ngbNavContent>
          <baw-wip>
            <p>TODO: Instructions</p>
          </baw-wip>
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

    <baw-harvest-upload-url [harvest]="harvest"></baw-harvest-upload-url>

    <hr />

    <baw-harvest-progress [harvest]="harvest"></baw-harvest-progress>

    <div class="clearfix">
      <button
        class="btn btn-warning float-start"
        [disabled]="loading"
        (click)="onCancel()"
      >
        Cancel
      </button>
      <button
        class="btn btn-primary float-end"
        [disabled]="loading"
        (click)="onFinishedUploading()"
      >
        Finished uploading
      </button>
    </div>
  `,
})
export class HarvestBatchUploadingComponent implements OnInit {
  public loading: boolean;
  public active = 1;

  public constructor(public stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  public onCancel(): void {
    this.transition("complete");
  }

  public onFinishedUploading(): void {
    this.transition("scanning");
  }

  private transition(stage: HarvestStatus) {
    this.loading = true;
    this.stages.transition(stage, () => (this.loading = false));
  }
}
