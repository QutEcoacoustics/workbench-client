import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfigService } from "@services/config/config.service";
import { DeviceDetectorService } from "ngx-device-detector";

export type UploadingInstructionTab="Windows"|"Mac"|"Linux"|"RClone"

@Component({
  selector: "baw-harvest-batch-uploading",
  templateUrl: "batch-uploading.component.html",
  styleUrls: ["batch-uploading.component.scss"],
})
export class BatchUploadingComponent implements OnInit {
  public active = 1;

  public constructor(
    public stages: HarvestStagesService,
    public modals: NgbModal,
    private config: ConfigService,
    private deviceDetector: DeviceDetectorService
  ) {}

  public ngOnInit(): void {
    this.stages.startPolling(5000);
    this.activateTab(this.deviceDetector.os as UploadingInstructionTab)
  }

  public activateTab(tabName: UploadingInstructionTab): void {
    this.active = Math.max(["Windows", "Mac", "Linux", "RClone"].indexOf(tabName) + 1, 1);
  }

  public get harvest(): Harvest {
    return this.stages.harvest;
  }

  public get project(): Project {
    return this.stages.project;
  }

  public get filenameGuide(): string {
    return this.config.settings.links.harvestFilenameGuide;
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

  public async abortUpload(template: any): Promise<void> {
    const ref = this.modals.open(template);
    const success = await ref.result.catch((_) => false);

    if (success) {
      this.stages.transition("complete");
    }
  }
}
