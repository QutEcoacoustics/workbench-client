import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ShallowHarvestsService } from "@baw-api/harvest/harvest.service";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { Harvest, HarvestStatus } from "@models/Harvest";
import filesize from "filesize";
import { ToastrService } from "ngx-toastr";

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

    <p>
      Server URL:
      <a target="_blank" [href]="harvest.uploadUrl">
        {{ harvest.uploadUrl }}
      </a>
    </p>

    <p>Username: {{ harvest.uploadUser }}</p>
    <p>Password: {{ harvest.uploadPassword }}</p>

    <hr />

    <!-- TODO Extract to sub component -->
    <h4>Current Progress</h4>

    <ul>
      <li><b>Uploaded Files: </b>{{ harvest.report.itemsTotal }}</li>
      <li>
        <b>Uploaded Bytes: </b>{{ harvest.report.itemsSizeBytes }} ({{
          filesize(harvest.report.itemsSizeBytes)
        }})
      </li>
    </ul>

    <div class="clearfix">
      <button
        class="btn btn-danger float-start"
        [disabled]="loading"
        (click)="onCancel()"
      >
        Cancel
      </button>
      <button
        class="btn btn-warning float-end"
        [disabled]="loading"
        (click)="onFinishedUploading()"
      >
        Upload batch
      </button>
    </div>
  `,
})
export class HarvestBatchUploadingComponent implements OnInit {
  @Input() public harvest: Harvest;
  @Input() public startPolling: (interval: number) => void;

  @Output() public stage = new EventEmitter<HarvestStage>();

  public loading: boolean;
  public active = 1;
  public filesize = filesize;

  public constructor(
    private notification: ToastrService,
    private harvestApi: ShallowHarvestsService
  ) {}

  public ngOnInit(): void {
    this.startPolling(1000);
  }

  public onCancel(): void {
    this.transition("complete");
  }

  public onFinishedUploading(): void {
    this.transition("scanning");
  }

  private transition(stage: HarvestStatus) {
    this.loading = true;

    // We want this api request to complete regardless of component destruction
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.harvestApi.transitionStatus(this.harvest, stage).subscribe({
      next: (harvest) => {
        this.loading = false;
        this.stage.emit(HarvestStage[harvest.status]);
      },
      error: (err: BawApiError) => {
        this.loading = false;
        this.notification.error(err.message);
      },
    });
  }
}
