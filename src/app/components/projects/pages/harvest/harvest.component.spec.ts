import { HarvestBatchUploadingComponent } from "@components/projects/components/harvest/batch-uploading.component";
import { HarvestCompleteComponent } from "@components/projects/components/harvest/complete.component";
import { HarvestMetadataExtractionComponent } from "@components/projects/components/harvest/metadata-extraction.component";
import { HarvestMetadataReviewComponent } from "@components/projects/components/harvest/metadata-review.component";
import { HarvestNewComponent } from "@components/projects/components/harvest/new.component";
import { HarvestProcessingComponent } from "@components/projects/components/harvest/processing.component";
import { HarvestReviewComponent } from "@components/projects/components/harvest/review.component";
import { HarvestScanningComponent } from "@components/projects/components/harvest/scanning.component";
import { HarvestStreamUploadingComponent } from "@components/projects/components/harvest/stream-uploading.component";
import { Project } from "@models/Project";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { StepperComponent } from "@shared/stepper/stepper.component";
import { generateProject } from "@test/fakes/Project";
import { MockComponents } from "ng-mocks";
import { HarvestComponent, HarvestStage } from "./harvest.component";

describe("HarvestComponent", () => {
  let defaultProject: Project;
  let spec: SpectatorRouting<HarvestComponent>;
  const createComponent = createRoutingFactory({
    component: HarvestComponent,
    declarations: MockComponents(
      HarvestNewComponent,
      HarvestScanningComponent,
      HarvestStreamUploadingComponent,
      HarvestBatchUploadingComponent,
      HarvestMetadataExtractionComponent,
      HarvestProcessingComponent,
      HarvestMetadataReviewComponent,
      HarvestReviewComponent,
      HarvestCompleteComponent
    ),
    imports: [SharedModule],
  });

  beforeEach(() => {
    defaultProject = new Project(generateProject());
  });

  function setup(project: Project = defaultProject) {
    spec = createComponent({
      detectChanges: false,
      data: { project: { model: project } },
    });
  }

  it("should create", () => {
    setup();
    spec.detectChanges();
    expect(spec.component).toBeInstanceOf(HarvestComponent);
  });

  it("should show project name", () => {
    setup();
    spec.detectChanges();
    expect(spec.query("h1")).toHaveText(defaultProject.name);
  });

  describe("stages", () => {
    function setStage(stage: HarvestStage) {
      setup();
      spec.detectChanges();
      spec.component.onStageChange(stage);
      spec.detectChanges();
    }

    function assertStage(stage: HarvestStage, component: any) {
      expect(spec.query(component)).toBeInstanceOf(component);
      expect(spec.query(StepperComponent).activeStep).toBe(stage);
    }

    it("should show new harvest stage", () => {
      setStage(HarvestStage.new_harvest);
      assertStage(HarvestStage.new_harvest, HarvestNewComponent);
    });

    it("should show stream uploading stage", () => {
      setStage(HarvestStage.uploading);
      spec.component.isStreaming = true;
      spec.detectChanges();
      assertStage(HarvestStage.uploading, HarvestStreamUploadingComponent);
    });

    it("should show batch uploading stage", () => {
      setStage(HarvestStage.uploading);
      spec.component.isStreaming = false;
      spec.detectChanges();
      assertStage(HarvestStage.uploading, HarvestBatchUploadingComponent);
    });

    it("should show scanning stage", () => {
      setStage(HarvestStage.scanning);
      assertStage(HarvestStage.scanning, HarvestScanningComponent);
    });

    it("should show metadata extraction stage", () => {
      setStage(HarvestStage.metadata_extraction);
      assertStage(
        HarvestStage.metadata_extraction,
        HarvestMetadataExtractionComponent
      );
    });

    it("should show metadata review stage", () => {
      setStage(HarvestStage.metadata_review);
      assertStage(HarvestStage.metadata_review, HarvestMetadataReviewComponent);
    });

    it("should show processing stage", () => {
      setStage(HarvestStage.processing);
      assertStage(HarvestStage.processing, HarvestProcessingComponent);
    });

    it("should show review stage", () => {
      setStage(HarvestStage.review);
      assertStage(HarvestStage.review, HarvestReviewComponent);
    });

    it("should show complete stage", () => {
      setStage(HarvestStage.complete);
      assertStage(HarvestStage.complete, HarvestCompleteComponent);
    });
  });
});
