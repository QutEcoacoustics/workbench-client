import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-harvest-batch-uploading",
  templateUrl: "batch-uploading.component.html",
  styleUrls: ["batch-uploading.component.scss"],
})
export class BatchUploadingComponent implements OnInit {
  public active = 1;

  public constructor(
    public stages: HarvestStagesService,
    public modals: NgbModal
  ) {}

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

  public async finishUpload(template: any): Promise<void> {
    const ref = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (success) {
      this.stages.transition("scanning");
    }
  }

  public async cancelUpload(template: any): Promise<void> {
    const ref = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (success) {
      this.stages.transition("complete");
    }
  }
}
