import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastService } from "@services/toasts/toasts.service";
import { AudioEventImport } from "@models/AudioEventImport";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { AUDIO_EVENT_IMPORT } from "@baw-api/ServiceTokens";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { of } from "rxjs";
import { UserLinkComponent } from "@shared/user-link/user-link.component";
import { User } from "@models/User";
import { generateUser } from "@test/fakes/User";
import { Filters } from "@baw-api/baw-api.service";
import { DateTime, Settings } from "luxon";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { fakeAsync, tick } from "@angular/core/testing";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { getElementByTextContent } from "@test/helpers/html";
import { AnnotationsListComponent } from "./list.component";

describe("AnnotationsListComponent", () => {
  let spectator: SpectatorRouting<AnnotationsListComponent>;
  let fakeAnnotationImport: AudioEventImport;
  let defaultUser: User;
  let defaultProject: Project;

  let mockApi: SpyObject<AudioEventImportService>;
  let modalService: SpyObject<NgbModal>;
  let modalConfigService: SpyObject<NgbModalConfig>;

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

    spectator = createComponent({
      detectChanges: false,
    });

    spyOnProperty(spectator.component, "project").and.callFake(
      () => defaultProject,
    );

    const injector = spectator.inject(ASSOCIATION_INJECTOR);
    mockApi = spectator.inject(AUDIO_EVENT_IMPORT.token);

    fakeAnnotationImport["injector"] = injector;

    mockApi.filter = jasmine.createSpy("filter") as any;
    mockApi.filter.and.callFake(() => of([fakeAnnotationImport]));

    mockApi.destroy = jasmine.createSpy("destroy") as any;
    mockApi.destroy.and.callFake(() => of(null));

    // inject the NgbModal service so that we can
    // dismiss all modals at the end of every test
    modalService = spectator.inject(NgbModal);

    // inject the bootstrap modal config service so that we can disable animations
    // this is needed so that modals can be opened without waiting for the async animation
    modalConfigService = spectator.inject(NgbModalConfig);
    modalConfigService.animation = false;

    // without mocking the timezone, tests that assert time will fail in CI
    // and other timezones that are not the same as the developers local timezone (UTC+8)
    // additionally, I chose Australia/Perth as day light savings is not observed in this timezone
    const mockUserTimeZone = "Australia/Perth"; // +08:00 UTC
    Settings.defaultZone = mockUserTimeZone;

    spectator.detectChanges();
  }

  const viewImportButton = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>("[name='view-button']");
  const deleteImportButton = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>("[name='delete-button']");
  // I must use { root: true }
  const modalConfirmButton = (): HTMLButtonElement =>
    spectator.query<HTMLButtonElement>(".btn-danger", { root: true });

  beforeEach(() => setup());

  afterEach(() => {
    // if we keep modals open, it will impact the next test
    // therefore, we should dismiss all modals at the end of every test
    modalService.dismissAll();
  });

  assertPageInfo(AnnotationsListComponent, "Import Annotations");

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationsListComponent);
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
      spectator,
      expectedLocalTime,
    );

    expect(importCreatedColumn).toExist();
  });

  fit("should have clickable view buttons next to each import", () => {
    const viewButton = viewImportButton();
    expect(viewButton).toExist();
  });

  it("should have a clickable delete button next to each import", () => {
    const deleteButton = deleteImportButton();
    expect(deleteButton).toExist();
  });

  it("should open a modal when the delete button is clicked", fakeAsync(() => {
    const deleteButton = deleteImportButton();
    deleteButton.click();

    tick();

    // we have to use root: true here otherwise the modal window cannot be queried
    const modalElement = spectator.query<HTMLElement>("ngb-modal-window", {
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
    const modalDeleteButton: HTMLButtonElement = modalConfirmButton();
    modalDeleteButton.click();

    tick();
    spectator.detectChanges();

    expect(mockApi.destroy).toHaveBeenCalledOnceWith(fakeAnnotationImport.id);
  }));
});
