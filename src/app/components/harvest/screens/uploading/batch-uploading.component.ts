import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest } from "@models/Harvest";

@Component({
  selector: "baw-harvest-batch-uploading",
  templateUrl: "batch-uploading.component.html",
})
export class BatchUploadingComponent implements OnInit {
  public active = 1;

  public constructor(public stages: HarvestStagesService) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
  }

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  public get loading(): boolean {
    return this.stages.transitioningStage;
  }

  public onCancel(): void {
    this.stages.transition("complete");
  }

  public onFinishedUploading(): void {
    this.stages.transition("scanning");
  }
}
