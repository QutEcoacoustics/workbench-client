import { BatchUploadingComponent } from "@components/harvest/screens/uploading/batch-uploading.component";
import { CompleteComponent } from "@components/harvest/screens/complete/complete.component";
import { MetadataExtractionComponent } from "@components/harvest/screens/metadata-extraction/metadata-extraction.component";
import { MetadataReviewComponent } from "@components/harvest/screens/metadata-review/metadata-review.component";
import { HarvestNewComponent } from "@components/harvest/pages/new/new.component";
import { ProcessingComponent } from "@components/harvest/screens/processing/processing.component";
import { HarvestReviewComponent } from "@components/projects/components/harvest/review.component";
import { ScanningComponent } from "@components/harvest/screens/scanning/scanning.component";
import { HarvestStreamUploadingComponent } from "@components/projects/components/harvest/stream-uploading.component";
import { Project } from "@models/Project";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { StepperComponent } from "@shared/stepper/stepper.component";
import { generateProject } from "@test/fakes/Project";
import { MockComponents } from "ng-mocks";
import { StateComponent, HarvestStage } from "./state.component";

describe("StateComponent", () => {
  let defaultProject: Project;
  let spec: SpectatorRouting<StateComponent>;
  const createComponent = createRoutingFactory({
    component: StateComponent,
    declarations: MockComponents(
      HarvestNewComponent,
      ScanningComponent,
      HarvestStreamUploadingComponent,
      BatchUploadingComponent,
      MetadataExtractionComponent,
      ProcessingComponent,
      MetadataReviewComponent,
      HarvestReviewComponent,
      CompleteComponent
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
    expect(spec.component).toBeInstanceOf(StateComponent);
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
      assertStage(HarvestStage.uploading, BatchUploadingComponent);
    });

    it("should show scanning stage", () => {
      setStage(HarvestStage.scanning);
      assertStage(HarvestStage.scanning, ScanningComponent);
    });

    it("should show metadata extraction stage", () => {
      setStage(HarvestStage.metadata_extraction);
      assertStage(
        HarvestStage.metadata_extraction,
        MetadataExtractionComponent
      );
    });

    it("should show metadata review stage", () => {
      setStage(HarvestStage.metadata_review);
      assertStage(HarvestStage.metadata_review, MetadataReviewComponent);
    });

    it("should show processing stage", () => {
      setStage(HarvestStage.processing);
      assertStage(HarvestStage.processing, ProcessingComponent);
    });

    it("should show review stage", () => {
      setStage(HarvestStage.review);
      assertStage(HarvestStage.review, HarvestReviewComponent);
    });

    it("should show complete stage", () => {
      setStage(HarvestStage.complete);
      assertStage(HarvestStage.complete, CompleteComponent);
    });
  });
});
