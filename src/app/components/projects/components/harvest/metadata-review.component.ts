import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { Observable } from "rxjs";

@Component({
  selector: "baw-harvest-metadata-review",
  template: `
    <h3>Review</h3>

    <p>This is a review of the audio data</p>

    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col" class="w-100">Path</th>
          <th scope="col">Point</th>
          <th scope="col">UTC Offset</th>
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
          <td>/{{ site.id }}</td>
          <td>{{ site.id }}</td>
          <td>
            <ng-container *ngIf="site.timezoneInformation">
              {{ humanizeOffset(site.timezoneInformation.utcOffset) }}

              <button class="btn btn-sm btn-secondary float-end">Change</button>
            </ng-container>
            <ng-container *ngIf="!site.timezoneInformation">
              <div class="input-group input-group-sm">
                <input class="form-control" type="text" placeholder="+hh:mm" />
                <button type="button" class="btn btn-outline-secondary">
                  Set
                </button>
              </div>
            </ng-container>
          </td>
        </tr>

        <tr *ngIf="sites.value">
          <td>/obviously_fake_path</td>
          <td>
            <div class="input-group input-group-sm">
              <input
                class="form-control"
                type="number"
                placeholder="point id"
              />
              <button type="button" class="btn btn-outline-secondary">
                Set
              </button>
            </div>
          </td>
          <td>
            <div class="input-group input-group-sm">
              <input class="form-control" type="text" placeholder="+hh:mm" />
              <button type="button" class="btn btn-outline-secondary">
                Set
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="clearfix">
      <button
        class="btn btn-outline-primary float-start"
        (click)="onBackClick()"
      >
        Make changes or upload more files
      </button>
      <button class="btn btn-primary float-end" (click)="onSaveClick()">
        Save and upload
      </button>
    </div>
  `,
  styles: [
    `
      .input-group {
        width: 170px;
      }
    `,
  ],
})
export class HarvestMetadataReviewComponent implements OnInit {
  @Output() public stage = new EventEmitter<HarvestStage>();

  public sites$: Observable<Site[]>;
  public project: Project;

  public constructor(
    private siteApi: SitesService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.project = retrieveResolvedModel(this.route.snapshot.data, Project);
    this.sites$ = this.siteApi.list(this.project);
  }

  public humanizeOffset(offset: number): string {
    if (!offset) {
      return undefined;
    }

    // Convert number to UTC offset
    const hours = Math.abs(offset / 3600)
      .toFixed(0)
      .padStart(2, "0");
    const minutes = Math.abs(offset % 3600)
      .toFixed(0)
      .padStart(2, "0");
    return `${offset < 0 ? "-" : "+"}${hours}:${minutes}`;
  }

  public onBackClick(): void {
    this.stage.emit(HarvestStage.uploading);
  }

  public onSaveClick(): void {
    this.stage.emit(HarvestStage.processing);
  }
}
