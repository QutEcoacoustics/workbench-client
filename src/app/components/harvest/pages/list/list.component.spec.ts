import { Injector } from "@angular/core";
import { discardPeriodicTasks, fakeAsync, flush, tick } from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { HARVEST } from "@baw-api/ServiceTokens";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  createRoutingFactory,
  SpectatorRouting,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateHarvest } from "@test/fakes/Harvest";
import {
  generateProject,
  generateProjectMeta
} from "@test/fakes/Project";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { ListComponent } from "./list.component";

describe("ListComponent", () => {
  let spec: SpectatorRouting<ListComponent>;
  let defaultProject: Project;
  let defaultHarvest: Harvest;
  let modalService: NgbModal;
  let modalConfigService: NgbModalConfig;

  const createComponent = createRoutingFactory({
    declarations: [ConfirmationComponent],
    component: ListComponent,
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastrService],
  });

  function setup(
    project: Project,
    mockHarvest: Harvest
  ) {
    spec = createComponent({
      detectChanges: false,
      data: {
        project: { model: project },
      },
    });

    const injector = spec.inject(Injector);
    project["injector"] = injector;

    const mockHarvestApi = spec.inject(HARVEST.token);
    mockHarvest.addMetadata({
      paging: { items: 1, page: 0, total: 1, maxPage: 5 },
    });

    // inject the NgbModal service so that we can
    // dismiss all modals at the end of every test
    modalService = spec.inject(NgbModal);

    // inject the boostrap modal config service so that we can disable animations
    // this is needed so that buttons can be clicked without waiting for the async animation
    modalConfigService = spec.inject(NgbModalConfig);
    modalConfigService.animation = false;

    // mock the harvest service filter API to populate the
    // list component ngx-datatable
    const mockResponse = of([mockHarvest]);
    mockHarvestApi.filter.and.callFake(() => mockResponse);
    mockHarvestApi.transitionStatus.and.callFake(() => of(mockHarvest));
    spec.detectChanges();

    return mockHarvestApi;
  }

  function getAbortButton(): HTMLButtonElement {
    return spec.debugElement.query(
      (el) => el.nativeElement.innerText === "Abort"
    ).nativeElement as HTMLButtonElement;
  }

  function getModalNextButton() {
    return spec.query<HTMLButtonElement>(
      "baw-harvest-confirmation-modal #next-btn",
      { root: true }
    );
  }

  function getModalCancelButton() {
    return spec.query<HTMLButtonElement>(
      "baw-harvest-confirmation-modal #cancel-btn",
      { root: true }
    );
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultProject.addMetadata(generateProjectMeta({}));
    defaultHarvest = new Harvest(generateHarvest({ status: "uploading" }));
  });

  afterEach(() => {
    // dismiss all bootstrap modals, so if a test fails
    // it doesn't impact future tests by using a stale modal
    modalService.dismissAll();
  });

  it("should create", () => {
    setup(defaultProject, defaultHarvest);
    expect(spec.component).toBeInstanceOf(ListComponent);
  });

  it("should not show abort button when harvest cannot be aborted", () => {
    // ensure harvest status is not an abortable state
    const unAbortableHarvest = new Harvest( generateHarvest({ status: "scanning" }) );

    setup(
      defaultProject,
      unAbortableHarvest
    );

    // assert abort button is not rendered
    expect(spec.query("button[name='list-abort-button']")).toBeFalsy();
  });

  it("should not change the status of a Harvest if the 'cancel' button is clicked in the abort modal", fakeAsync(() => {
    const harvestApi = setup(defaultProject, defaultHarvest);

    getAbortButton().click();
    tick();

    getModalCancelButton().click();
    tick();

    expect(harvestApi.transitionStatus).not.toHaveBeenCalled();
    discardPeriodicTasks();
    flush();
  }));

  it("should abort Harvest by changing status to 'complete' if the 'Abort Harvest' button is clicked in the abort modal", fakeAsync(() => {
    const harvestApi = setup(defaultProject, defaultHarvest);

    getAbortButton().click();
    tick();

    getModalNextButton().click();
    tick();

    expect(harvestApi.transitionStatus).toHaveBeenCalledWith(defaultHarvest, "complete");
    discardPeriodicTasks();
    flush();
  }));

});
