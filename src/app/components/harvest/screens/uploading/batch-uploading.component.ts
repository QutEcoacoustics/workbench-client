import { Component, OnInit } from "@angular/core";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import {
  NgbModal,
  NgbNav,
  NgbNavItem,
  NgbNavItemRole,
  NgbNavLink,
  NgbNavLinkBase,
  NgbNavContent,
  NgbNavOutlet,
} from "@ng-bootstrap/ng-bootstrap";
import { ConfigService } from "@services/config/config.service";
import { DeviceDetectorService } from "ngx-device-detector";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { DecimalPipe } from "@angular/common";
import { UploadUrlComponent } from "../../components/shared/upload-url.component";
import { ConfirmationComponent } from "../../components/modal/confirmation.component";
import { SafePipe } from "../../../../pipes/safe/safe.pipe";

export type UploadingInstructionTab = "Windows" | "Mac" | "Linux" | "RClone";

@Component({
  selector: "baw-harvest-batch-uploading",
  templateUrl: "batch-uploading.component.html",
  styleUrls: ["batch-uploading.component.scss"],
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavItemRole,
    NgbNavLink,
    NgbNavLinkBase,
    NgbNavContent,
    NgbNavOutlet,
    FaIconComponent,
    UploadUrlComponent,
    ConfirmationComponent,
    DecimalPipe,
    SafePipe,
  ],
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
    this.activateTab(this.deviceDetector.os as UploadingInstructionTab);
  }

  public activateTab(tabName: UploadingInstructionTab): void {
    this.active = Math.max(
      ["Windows", "Mac", "Linux", "RClone"].indexOf(tabName) + 1,
      1
    );
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
