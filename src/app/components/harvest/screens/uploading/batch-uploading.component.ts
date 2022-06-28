import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestStatus } from "@models/Harvest";

@Component({
  selector: "baw-harvest-batch-uploading",
  templateUrl: "batch-uploading.component.html",
})
export class BatchUploadingComponent implements OnInit {
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
