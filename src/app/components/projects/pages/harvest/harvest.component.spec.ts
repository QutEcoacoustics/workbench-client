import { HarvestBatchUploadingComponent } from "@components/projects/components/harvest/batch-uploading.component";
import { HarvestCompleteComponent } from "@components/projects/components/harvest/complete.component";
import { HarvestMetadataExtractionComponent } from "@components/projects/components/harvest/metadata-extraction.component";
import { HarvestMetadataReviewComponent } from "@components/projects/components/harvest/metadata-review.component";
import { HarvestNewComponent } from "@components/projects/components/harvest/new.component";
import { HarvestProcessingComponent } from "@components/projects/components/harvest/processing.component";
import { HarvestReviewComponent } from "@components/projects/components/harvest/review.component";
import { HarvestStreamUploadingComponent } from "@components/projects/components/harvest/stream-uploading.component";
import { Project } from "@models/Project";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
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
      HarvestStreamUploadingComponent,
      HarvestBatchUploadingComponent,
      HarvestMetadataExtractionComponent,
      HarvestProcessingComponent,
      HarvestMetadataReviewComponent,
      HarvestReviewComponent,
      HarvestCompleteComponent
    ),
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
    function assertStage(stage: HarvestStage, component: any) {
      setup();
      spec.detectChanges();
      spec.component.setStage(stage);
      spec.detectChanges();
      expect(spec.query(component)).toBeInstanceOf(component);
    }

    it("should show new harvest stage", () => {
      setup();
      spec.detectChanges();
      expect(spec.query(HarvestNewComponent)).toBeInstanceOf(
        HarvestNewComponent
      );
    });

    it("should show stream uploading stage", () => {
      assertStage(
        HarvestStage.streamUploading,
        HarvestStreamUploadingComponent
      );
    });

    it("should show batch uploading stage", () => {
      assertStage(HarvestStage.batchUploading, HarvestBatchUploadingComponent);
    });

    it("should show metadata extraction stage", () => {
      assertStage(
        HarvestStage.metadataExtraction,
        HarvestMetadataExtractionComponent
      );
    });

    it("should show metadata review stage", () => {
      assertStage(HarvestStage.metadataReview, HarvestMetadataReviewComponent);
    });

    it("should show processing stage", () => {
      assertStage(HarvestStage.processing, HarvestProcessingComponent);
    });

    it("should show review stage", () => {
      assertStage(HarvestStage.review, HarvestReviewComponent);
    });

    it("should show complete stage", () => {
      assertStage(HarvestStage.complete, HarvestCompleteComponent);
    });
  });
});
