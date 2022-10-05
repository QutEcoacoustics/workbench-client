import { discardPeriodicTasks, fakeAsync, flush, tick } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { HarvestStagesService } from "@components/harvest/services/harvest-stages.service";
import {
  Harvest,
  HarvestStatus
} from "@models/Harvest";
import { Project } from "@models/Project";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  SpectatorRouting,
  SpyObject,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateHarvest } from "@test/fakes/Harvest";
import {
  generateProject,
  generateProjectMeta
} from "@test/fakes/Project";
import { MockProvider } from "ng-mocks";
import { ToastrService } from "ngx-toastr";
import { MetadataReviewComponent } from "./metadata-review.component";

describe("MetaDatReviewComponent", () => {
  let spec: SpectatorRouting<MetadataReviewComponent>;
  let modalService: NgbModal;
  let modalConfigService: NgbModalConfig;
  let stages: SpyObject<HarvestStagesService>;
  let defaultProject: Project;
  let defaultHarvest: Harvest;

  const createComponent = createRoutingFactory({
    declarations: [ConfirmationComponent],
    component: MetadataReviewComponent,
    providers: [
      MockProvider(HarvestStagesService, {
        project: defaultProject,
        harvest: defaultHarvest,
        transition: (_stage: HarvestStatus) => {}
      }),
    ],
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastrService],
  });

  function setup() {
    spec = createComponent({ detectChanges: false });

    // inject the NgbModal service so that we can
    // dismiss all modals at the end of every test
    modalService = spec.inject(NgbModal);

    // inject the boostrap modal config service so that we can disable animations
    // this is needed so that buttons can be clicked without waiting for the async animation
    modalConfigService = spec.inject(NgbModalConfig);
    modalConfigService.animation = false;

    stages = spec.inject<SpyObject<HarvestStagesService>>( HarvestStagesService as any );
    stages.transition = jasmine.createSpy("transition") as any;

    return stages;
  }

  const getModalNextButton = (): HTMLButtonElement =>
      spec.query<HTMLButtonElement>("baw-harvest-confirmation-modal #next-btn", { root: true });

  const getModalCancelButton = (): HTMLButtonElement =>
    spec.query<HTMLButtonElement>("baw-harvest-confirmation-modal #cancel-btn", { root: true });

  function getAbortButton(): HTMLButtonElement {
    return spec.debugElement.query(
      (el) => el.nativeElement.innerText === "Abort"
    ).nativeElement as HTMLButtonElement;
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultProject.addMetadata(generateProjectMeta({}));
    defaultHarvest = new Harvest(generateHarvest({ status: "metadataReview" }));
  });

  afterEach(() => {
    // dismiss all bootstrap modals, so if a test fails
    // it doesn't impact future tests by using a stale modal
    modalService.dismissAll();
  });

  it("should create", () => {
    setup();
    expect(spec.component).toBeInstanceOf(MetadataReviewComponent);
  });

  it("should dismiss abort warning modal and not transition the Harvest status when the 'return' button is clicked", fakeAsync(() => {
    setup();

    getAbortButton().click();
    tick();

    getModalCancelButton().click();
    tick();

    expect(stages.transition).not.toHaveBeenCalled();
    discardPeriodicTasks();
    flush();
  }));

  it("should transition the Harvest to 'complete' when the 'Abort Harvest' button is clicked in abort warning modal", fakeAsync(() => {
    setup();

    getAbortButton().click();
    tick();

    getModalNextButton().click();
    tick();

    expect(stages.transition).toHaveBeenCalledWith("complete");
    discardPeriodicTasks();
    flush();
  }));

});
