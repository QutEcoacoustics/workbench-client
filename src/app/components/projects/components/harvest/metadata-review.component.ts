import {
  Component,
  EventEmitter,
  Injector,
  OnInit,
  Output,
  ViewEncapsulation,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { retrieveResolvedModel } from "@baw-api/resolver-common";
import { SitesService } from "@baw-api/site/sites.service";
import { HarvestStage } from "@components/projects/pages/harvest/harvest.component";
import { UnsavedInputCheckingComponent } from "@guards/input/input.guard";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { Harvest, IHarvestMapping } from "@models/Harvest";
import { Project } from "@models/Project";
import { ConfigService } from "@services/config/config.service";
import { generateHarvest } from "@test/fakes/Harvest";
import { takeUntil } from "rxjs";

@Component({
  selector: "baw-harvest-metadata-review",
  template: `
    <h3>Review</h3>

    <p>This is a review of the audio data</p>

    <div class="table table-sm table-striped grid-table">
      <div class="grid-table-header">
        <div>Path</div>
        <div>{{ siteColumnLabel }}</div>
        <div>UTC Offset</div>
      </div>

      <baw-mapping-form
        *ngFor="let mapping of mappings; let i = index; trackBy: trackByPath"
        class="grid-table-row"
        [project]="project"
        [(mapping)]="mappings[i]"
      ></baw-mapping-form>
    </div>

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
  styleUrls: ["metadata-review.component.scss"],
})
export class HarvestMetadataReviewComponent
  extends withUnsubscribe()
  implements OnInit, UnsavedInputCheckingComponent
{
  @Output() public stage = new EventEmitter<HarvestStage>();

  public hasUnsavedChange: boolean;

  public project: Project;
  public siteColumnLabel: string;
  public harvest: Harvest;
  public mappings: IHarvestMapping[] = [];

  public constructor(
    private config: ConfigService,
    private siteApi: SitesService,
    private route: ActivatedRoute,
    private injector: Injector
  ) {
    super();
  }

  public ngOnInit(): void {
    this.project = retrieveResolvedModel(this.route.snapshot.data, Project);
    this.siteColumnLabel = this.config.settings.hideProjects ? "Point" : "Site";
    this.harvest = new Harvest(generateHarvest(), this.injector);

    // TODO this is temporary until we have a real API
    this.siteApi
      .list(this.project)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((sites) => {
        this.mappings = sites.map((site) => ({
          path: site.id + "/",
          siteId: site.id,
          utcOffset: undefined,
          recursive: false,
        }));

        this.mappings.push({
          path: "obviously_wrong_path/",
          recursive: true,
        });
      });
  }

  public setMapping(index: number, mapping: IHarvestMapping) {
    this.mappings[index] = mapping;
  }

  public onGoForwards(): void {
    // If changes made to harvest, show warning modal
  }

  public trackByPath(_: number, mapping: IHarvestMapping) {
    return mapping.path;
  }

  public onBackClick(): void {
    this.stage.emit(HarvestStage.uploading);
  }

  public onSaveClick(): void {
    this.stage.emit(HarvestStage.processing);
  }
}
