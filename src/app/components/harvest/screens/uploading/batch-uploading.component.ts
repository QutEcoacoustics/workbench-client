import { Component, OnInit } from "@angular/core";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { Site } from "@models/Site";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";

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

  public constructor(
    public stages: HarvestStagesService,
    private modal: NgbModal
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

  public async openCancelModal(): Promise<void> {
    const ref = this.modal.open(ConfirmationComponent, { centered: true });
    ref.componentInstance.description =
      "Are you sure you want to cancel this upload? Any uploaded files will be deleted!";
    ref.componentInstance.cancelBtn = "Return";
    ref.componentInstance.nextBtn = "Cancel Upload";

    try {
      await ref.result;
      this.stages.transition("complete");
    } catch (err) {}
  }

  public async openFinishedUploadingModal(): Promise<void> {
    const ref = this.modal.open(ConfirmationComponent, { centered: true });
    ref.componentInstance.description =
      "Are you sure your upload is finished? You can come back here later, if there are any issues.";
    ref.componentInstance.cancelBtn = "Cancel";
    ref.componentInstance.nextBtn = "Scan Files";

    try {
      await ref.result;
      this.stages.transition("scanning");
    } catch (err) {}
  }

  public onCancel(modal: NgbActiveModal): void {
    this.stages.transition("complete");
    modal.close();
  }

  public onFinishedUploading(modal: NgbActiveModal): void {
    this.stages.transition("scanning");
    modal.close();
  }
}
