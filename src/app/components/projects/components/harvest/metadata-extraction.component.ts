import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/projects/pages/harvest/harvest.service";
import { HarvestReport } from "@models/Harvest";

@Component({
  selector: "baw-harvest-metadata-extraction",
  template: `
    <h3>Checking Files</h3>

    <p>We are checking the files you uploaded!</p>

    <p>
      We will make sure files have no errors and find any extra information
      about them.
    </p>

    <baw-harvest-can-close-dialog></baw-harvest-can-close-dialog>

    <div class="progress">
      <baw-progress-bar
        style="display: contents"
        color="success"
        description="Files which have had their metadata successfully extracted"
        [progress]="successProgress"
      ></baw-progress-bar>

      <baw-progress-bar
        style="display: contents"
        color="warning"
        description="Files which have some problems, however can be fixed"
        [progress]="invalidFixableProgress"
      ></baw-progress-bar>

      <baw-progress-bar
        style="display: contents"
        color="danger"
        description="Files which have some problems, and cannot be fixed"
        [progress]="errorProgress"
      ></baw-progress-bar>
    </div>
  `,
})
export class HarvestMetadataExtractionComponent implements OnInit {
  public constructor(private stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get successProgress(): number {
    return this.stages.calculateProgress(
      this.report.itemsMetadataGathered -
        this.report.itemsInvalidFixable -
        this.report.itemsInvalidNotFixable
    );
  }

  public get invalidFixableProgress(): number {
    return this.stages.calculateProgress(this.report.itemsInvalidFixable);
  }

  public get errorProgress(): number {
    return this.stages.calculateProgress(
      this.report.itemsInvalidNotFixable +
        this.report.itemsErrored +
        this.report.itemsFailed
    );
  }

  private get report(): HarvestReport {
    return this.stages.harvest.report;
  }
}
