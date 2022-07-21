import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { Site } from "@models/Site";

@Component({
  selector: "baw-harvest-batch-uploading",
  templateUrl: "batch-uploading.component.html",
  styles: [
    `
      .red {
        color: red;
      }

      .icon-wrapper {
        margin: 0 auto 0.5rem auto;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
      }
    `,
  ],
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

  public get project(): Project {
    return this.stages.project;
  }

  public get loading(): boolean {
    return this.stages.transitioningStage;
  }

  public exampleSite(project: Project): Site {
    return project.sites[0];
  }

  public onCancel(): void {
    this.stages.transition("complete");
  }

  public onFinishedUploading(): void {
    this.stages.transition("scanning");
  }
}
