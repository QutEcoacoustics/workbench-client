import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { CompleteComponent } from "@components/harvest/screens/complete/complete.component";
import { MetadataExtractionComponent } from "@components/harvest/screens/metadata-extraction/metadata-extraction.component";
import { MetadataReviewComponent } from "@components/harvest/screens/metadata-review/metadata-review.component";
import { ProcessingComponent } from "@components/harvest/screens/processing/processing.component";
import { ScanningComponent } from "@components/harvest/screens/scanning/scanning.component";
import { BatchUploadingComponent } from "@components/harvest/screens/uploading/batch-uploading.component";
import { StreamUploadingComponent } from "@components/harvest/screens/uploading/stream-uploading.component";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import { Harvest, HarvestStatus } from "@models/Harvest";
import { Project } from "@models/Project";
import {
  createRoutingFactory,
  mockProvider,
  SpectatorRouting,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { StepperComponent } from "@shared/stepper/stepper.component";
import { generateHarvest } from "@test/fakes/Harvest";
import { generateProject } from "@test/fakes/Project";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastService } from "@services/toasts/toasts.service";
import { PageTitleStrategy } from "src/app/app.component";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { TitleComponent } from "@components/harvest/components/shared/title.component";
import { getElementByInnerText } from "@test/helpers/html";
import { DetailsComponent } from "./details.component";

describe("DetailsComponent", () => {
  let spec: SpectatorRouting<DetailsComponent>;
  let defaultProject: Project;
  let defaultHarvest: Harvest;

  const createComponent = createRoutingFactory({
    component: DetailsComponent,
    declarations: [
      ScanningComponent,
      StreamUploadingComponent,
      BatchUploadingComponent,
      MetadataExtractionComponent,
      ProcessingComponent,
      MetadataReviewComponent,
      CompleteComponent,
      WebsiteStatusWarningComponent,
      TitleComponent,
    ],
    providers: [mockProvider(HarvestStagesService), PageTitleStrategy],
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastService],
  });

  assertPageInfo<Harvest>(DetailsComponent, "test name", {
    harvest: {
      model: new Harvest(generateHarvest({ name: "test name" })),
    },
  });

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultHarvest = new Harvest(generateHarvest());
  });

  function setup(): void {
    spec = createComponent({
      data: {
        project: { model: defaultProject },
        harvest: { model: defaultHarvest },
      },
    });
  }

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(DetailsComponent);
  });

  it("should show project name", () => {
    setup();

    const expectedTitle = `Project: ${defaultProject.name}`;
    const titleElement = getElementByInnerText(spec, expectedTitle);

    expect(titleElement).toExist();
  });

  it("should show the harvest name", () => {
    setup();

    const expectedTitle = `Upload Recordings: ${defaultHarvest.name}`;
    const titleElement = getElementByInnerText(spec, expectedTitle);

    expect(titleElement).toExist();
  });

  // TODO: Re-implement tests
  xdescribe("stages", () => {
    function setStage(stage: HarvestStatus) {
      setup();
      spec.detectChanges();
      spec.component.onStageChange(stage);
      spec.detectChanges();
    }

    function assertStage(stage: number, component: any) {
      expect(spec.query(component)).toBeInstanceOf(component);
      expect(spec.query(StepperComponent).activeStep).toBe(stage);
    }

    it("should show stream uploading stage", () => {
      setStage("uploading");
      spec.component.isStreaming = true;
      spec.detectChanges();
      assertStage(1, StreamUploadingComponent);
    });

    it("should show batch uploading stage", () => {
      setStage("uploading");
      spec.component.isStreaming = false;
      spec.detectChanges();
      assertStage(1, BatchUploadingComponent);
    });

    it("should show scanning stage", () => {
      setStage("scanning");
      assertStage(2, ScanningComponent);
    });

    it("should show metadata extraction stage", () => {
      setStage("metadataExtraction");
      assertStage(3, MetadataExtractionComponent);
    });

    it("should show metadata review stage", () => {
      setStage("metadataReview");
      assertStage(4, MetadataReviewComponent);
    });

    it("should show processing stage", () => {
      setStage("processing");
      assertStage(4, ProcessingComponent);
    });

    it("should show complete stage", () => {
      setStage("complete");
      assertStage(5, CompleteComponent);
    });
  });
});
