import { fakeAsync, tick } from "@angular/core/testing";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { Filters } from "@baw-api/baw-api.service";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { AudioEventImport } from "@models/AudioEventImport";
import { Project } from "@models/Project";
import { User } from "@models/User";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { ToastService } from "@services/toasts/toasts.service";
import { UserLinkComponent } from "@shared/user-link/user-link.component";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { generateProject } from "@test/fakes/Project";
import { generateUser } from "@test/fakes/User";
import { getElementByTextContent } from "@test/helpers/html";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { DateTime, Settings } from "luxon";
import { of } from "rxjs";
import { AnnotationsListComponent } from "./list.component";

describe("AnnotationsListComponent", () => {
  let spec: SpectatorRouting<AnnotationsListComponent>;
  let fakeAnnotationImport: AudioEventImport;
  let defaultUser: User;
  let defaultProject: Project;

  let mockApi: SpyObject<AudioEventImportService>;
  let modalService: SpyObject<NgbModal>;

  const createComponent = createRoutingFactory({
    component: AnnotationsListComponent,
    imports: [UserLinkComponent],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  function setup(): void {
    defaultUser = new User(generateUser());
    defaultProject = new Project(generateProject());

    // we set the dateTime manually so that we can make assertions in tests about localised time
    const createdAt = DateTime.fromISO("2022-11-04T20:12:31.000Z");
    fakeAnnotationImport = new AudioEventImport(
      generateAudioEventImport({
        createdAt,
      }),
    );

    fakeAnnotationImport.addMetadata({
      paging: { items: 1, page: 0, total: 1, maxPage: 5 },
    });
    spyOnProperty(fakeAnnotationImport, "creator").and.callFake(
      () => defaultUser,
    );

    spec = createComponent({
      detectChanges: false,
    });

    spyOnProperty(spec.component, "project").and.callFake(
      () => defaultProject,
    );

    const injector = spec.inject(ASSOCIATION_INJECTOR);
    mockApi = spec.inject(AudioEventImportService);

    fakeAnnotationImport["injector"] = injector;

    mockApi.filter = jasmine.createSpy("filter") as any;
    mockApi.filter.and.callFake(() => of([fakeAnnotationImport]));

    mockApi.destroy = jasmine.createSpy("destroy") as any;
    mockApi.destroy.and.callFake(() => of(null));

    // inject the NgbModal service so that we can
    // dismiss all modals at the end of every test
    modalService = spec.inject(NgbModal);

    // inject the bootstrap modal config service so that we can disable animations
    // this is needed so that modals can be opened without waiting for the async animation
    const modalConfigService = spec.inject(NgbModalConfig);
    modalConfigService.animation = false;

    // without mocking the timezone, tests that assert time will fail in CI
    // and other timezones that are not the same as the developers local timezone (UTC+8)
    // additionally, I chose Australia/Perth as day light savings is not observed in this timezone
    const mockUserTimeZone = "Australia/Perth"; // +08:00 UTC
    Settings.defaultZone = mockUserTimeZone;

    spec.detectChanges();
  }

  const viewImportButton = () =>
    spec.query<HTMLButtonElement>("[name='view-button']");
  const verifyImportButton = () =>
    spec.query<HTMLButtonElement>("[name='verify-button']");
  const deleteImportButton = () =>
    spec.query<HTMLButtonElement>("[name='delete-button']");
  // I must use { root: true } because the modal is appended to the document
  // body instead of inside the component.
  const modalConfirmButton = () =>
    spec.query<HTMLButtonElement>(".btn-danger", { root: true });

  beforeEach(() => {
    setup();
  });

  afterEach(() => {
    // if we keep modals open, it will impact the next test
    // therefore, we should dismiss all modals at the end of every test
    modalService.dismissAll();
  });

  assertPageInfo(AnnotationsListComponent, "Import Annotations");

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(AnnotationsListComponent);
  });

  it("should make one api call on load", () => {
    expect(mockApi.filter).toHaveBeenCalledTimes(1);
  });

  it("should make the correct api call on load", () => {
    const expectedFilterBody: Filters<AudioEventImport> = {
      sorting: { direction: "desc", orderBy: "createdAt" },
      paging: { page: 1 },
    };

    expect(mockApi.filter).toHaveBeenCalledWith(expectedFilterBody);
  });

  it("should show created dates in the users local timezone", () => {
    const expectedLocalTime = "2022-11-05 04:12:31";

    const importCreatedColumn = getElementByTextContent<HTMLTableCellElement>(
      spec,
      expectedLocalTime,
    );

    expect(importCreatedColumn).toExist();
  });

  it("should have clickable view buttons next to each import", () => {
    expect(viewImportButton()).toExist();
  });

  it("should have clickable verify buttons next to each import", () => {
    expect(verifyImportButton()).toExist();
  });

  it("should have a clickable delete button next to each import", () => {
    expect(deleteImportButton()).toExist();
  });

  it("should open a modal when the delete button is clicked", fakeAsync(() => {
    const deleteButton = deleteImportButton();
    deleteButton.click();

    tick();

    // we have to use root: true here otherwise the modal window cannot be queried
    const modalElement = spec.query<HTMLElement>("ngb-modal-window", {
      root: true,
    });
    expect(modalElement).toExist();
  }));

  it("should make the correct api call when the delete button in the delete modal is clicked", fakeAsync(() => {
    // open the modal
    const deleteButton = deleteImportButton();
    deleteButton.click();

    tick();

    // click the confirmation button inside the modal
    const modalDeleteButton = modalConfirmButton();
    modalDeleteButton.click();

    tick();
    spec.detectChanges();

    expect(mockApi.destroy).toHaveBeenCalledOnceWith(fakeAnnotationImport.id);
  }));
});
