import { Injector } from "@angular/core";
import {
  discardPeriodicTasks,
  fakeAsync,
  flush,
  tick,
} from "@angular/core/testing";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { SHALLOW_HARVEST } from "@baw-api/ServiceTokens";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { Harvest } from "@models/Harvest";
import { Project } from "@models/Project";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { createRoutingFactory, SpectatorRouting } from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { generateHarvest } from "@test/fakes/Harvest";
import { generateProject, generateProjectMeta } from "@test/fakes/Project";
import { ToastrService } from "ngx-toastr";
import { of } from "rxjs";
import { DateTime } from "luxon";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { UserLinkComponent } from "@shared/user-link/user-link/user-link.component";
import { withDefaultZone } from "@test/helpers/mocks";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { ListComponent } from "./list.component";

describe("ListComponent", () => {
  let spec: SpectatorRouting<ListComponent>;
  let defaultProject: Project;
  let defaultHarvest: Harvest;
  let defaultUser: User;
  let modalService: NgbModal;
  let modalConfigService: NgbModalConfig;

  const createComponent = createRoutingFactory({
    declarations: [
      ConfirmationComponent,
      UserLinkComponent,
      WebsiteStatusWarningComponent,
    ],
    component: ListComponent,
    imports: [MockBawApiModule, SharedModule],
    mocks: [ToastrService],
  });

  function setup(project: Project | null, mockHarvest: Harvest) {
    spec = createComponent({
      detectChanges: false,
      data: {
        project: { model: project },
      },
    });

    const injector = spec.inject(Injector);

    if (project) {
      project["injector"] = injector;
    }

    mockHarvest["injector"] = injector;

    spyOnProperty(spec.component, "project").and.callFake(() => project);

    const mockHarvestApi = spec.inject(SHALLOW_HARVEST.token);
    mockHarvest.addMetadata({
      paging: { items: 1, page: 0, total: 1, maxPage: 5 },
    });

    // since the harvest creator is a resolved model, we need to mock the creator property
    spyOnProperty(mockHarvest, "creator").and.callFake(() => defaultUser);

    const mockHarvestProject: Project = project ? project : new Project(generateProject());
    spyOnProperty(mockHarvest, "project").and.callFake(() => mockHarvestProject);

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

  function getCreatorColumnElement(): HTMLElement {
    return spec.query("baw-user-link");
  }

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spec.debugElement.query(
      (element) => element.nativeElement.innerText === text
    )?.nativeElement as T;
  }

  beforeEach(() => {
    defaultProject = new Project(generateProject());
    defaultProject.addMetadata(generateProjectMeta({}));
    defaultHarvest = new Harvest(generateHarvest({ status: "uploading" }));
    defaultUser = new User(generateUser());
  });

  afterEach(() => {
    // dismiss all bootstrap modals, so if a test fails
    // it doesn't impact future tests by using a stale modal
    modalService?.dismissAll();
  });

  assertPageInfo(ListComponent, ["Recording Uploads", "All Recording Uploads"]);

  it("should create", () => {
    setup(defaultProject, defaultHarvest);
    expect(spec.component).toBeInstanceOf(ListComponent);
  });

  it("should not show abort button when harvest cannot be aborted", () => {
    // ensure harvest status is not an abortable state
    const unAbortableHarvest = new Harvest(
      generateHarvest({ status: "scanning" })
    );

    setup(defaultProject, unAbortableHarvest);

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

    expect(harvestApi.transitionStatus).toHaveBeenCalledWith(
      defaultHarvest,
      "complete"
    );
    discardPeriodicTasks();
    flush();
  }));

  withDefaultZone("Australia/Perth", () => {
    it("should show created dates in the users local dateTime", () => {
      const harvestUtcCreatedAt = DateTime.fromISO("2020-01-01T00:00:00.000Z");
      const expectedLocalCreatedAt = "2020-01-01 08:00:00";
      defaultHarvest = new Harvest(
        generateHarvest({ createdAt: harvestUtcCreatedAt })
      );

      setup(defaultProject, defaultHarvest);

      const createdAtLabel = getElementByInnerText<HTMLSpanElement>(
        expectedLocalCreatedAt
      );
      expect(createdAtLabel).toExist();
    });

    it("formatDate should return a dateTime object in the users local time zone when a UTC+0 date is passed to it", () => {
      const utcTime = DateTime.fromISO("2022-11-04T20:12:31.000Z");
      const expectedLocalTime = "2022-11-05 04:12:31";

      setup(defaultProject, defaultHarvest);

      const realizedTime = spec.component.formatDate(utcTime);
      expect(realizedTime).toEqual(expectedLocalTime);
    });
  });

  // if you are using the association directive directly in the template, this test will fail
  // this is because change detection will not trigger when the model is changed from an UnresolvedModel to a resolved model
  it("should display a the harvest creator in the creators column", () => {
    const expectedUserName: string = defaultUser.userName;
    setup(defaultProject, defaultHarvest);

    const creatorColumn: HTMLElement = getCreatorColumnElement();

    expect(creatorColumn.innerText).toEqual(expectedUserName);
  });

  it("should use projection in the api requests to load a subset of harvest properties", () => {
    const harvestApi = setup(defaultProject, defaultHarvest);

    expect(harvestApi.filter).toHaveBeenCalledWith(
      jasmine.objectContaining({
        projection: {
          include: [
            "id",
            "projectId",
            "name",
            "createdAt",
            "creatorId",
            "streaming",
            "status",
          ],
        },
      })
    );
  });

  // if this test if failing, it is either because the harvest api is not called, or called twice (or more)
  // either in the harvest list page is faulty or our datatable pagination directive is faulty
  it("should call the harvest api once on load", () => {
    const harvestApi = setup(defaultProject, defaultHarvest);
    expect(harvestApi.filter).toHaveBeenCalledTimes(1);
  });

  it("should make the correct api calls for a harvest list scoped to a project", () => {
    const harvestApi = setup(defaultProject, defaultHarvest);
    expect(harvestApi.filter).toHaveBeenCalledWith(
      jasmine.objectContaining({
        filter: {
          projectId: {
            eq: defaultProject.id,
          },
        },
      })
    );
  });

  it("should make the correct api calls for an unscoped harvest list", () => {
    // to unscope the harvest list, we return `null` from the project getter
    const harvestApi = setup(null, defaultHarvest);
    expect(harvestApi.filter).not.toHaveBeenCalledWith(
      jasmine.objectContaining({
        filter: jasmine.any(Object),
      })
    );
  });

  it("should not display the harvest project name in the project column if the harvest list is scoped to a project", () => {
    setup(defaultProject, defaultHarvest);
    const projectColumnHeader =
      getElementByInnerText<HTMLTableCellElement>("Project");
    expect(projectColumnHeader).not.toExist();
  });

  it("should display the harvest project name in the project column if the harvest list is not scoped to a project", () => {
    setup(null, defaultHarvest);

    const expectedProject: Project = defaultHarvest.project;
    const expectedProjectName: string = expectedProject.name;

    const projectNameColumnValue: HTMLTableCellElement =
      getElementByInnerText(expectedProjectName);

    expect(projectNameColumnValue).toExist();
  });
});
