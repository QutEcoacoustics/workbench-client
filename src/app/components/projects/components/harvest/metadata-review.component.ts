import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { ConfigService } from "@services/config/config.service";
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
          <th scope="col">{{ siteColumnLabel }}</th>
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
          <td>
            <baw-site-selector
              [project]="project"
              [site]="site"
            ></baw-site-selector>
          </td>
          <td>
            <baw-utc-offset-selector
              [project]="project"
              [site]="site"
            ></baw-utc-offset-selector>
          </td>
        </tr>

        <tr *ngIf="sites.value">
          <td>/obviously_fake_path</td>
          <td>
            <baw-site-selector [project]="project"></baw-site-selector>
          </td>
          <td>
            <baw-utc-offset-selector
              [project]="project"
            ></baw-utc-offset-selector>
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
      <!-- Redirect to metadata extraction instead of next step if changes made -->
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
  public siteColumnLabel: string;

  public constructor(
    private config: ConfigService,
    private siteApi: SitesService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.project = retrieveResolvedModel(this.route.snapshot.data, Project);
    this.sites$ = this.siteApi.list(this.project);
    this.siteColumnLabel = this.config.settings.hideProjects ? "Point" : "Site";
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
