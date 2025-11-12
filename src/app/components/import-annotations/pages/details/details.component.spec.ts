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
import { TagsService } from "@baw-api/tag/tags.service";
import { Tag } from "@models/Tag";
import { of, Subject } from "rxjs";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import {
  AUDIO_EVENT_IMPORT,
  AUDIO_EVENT_IMPORT_FILE,
  AUDIO_EVENT_PROVENANCE,
  AUDIO_RECORDING,
  SHALLOW_AUDIO_EVENT,
  TAG,
} from "@baw-api/ServiceTokens";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import { Settings } from "luxon";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { AudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import { assertDatatable } from "@test/helpers/datatable";
import { NgbModalConfig, NgbNavConfig } from "@ng-bootstrap/ng-bootstrap";
import { modelData } from "@test/helpers/faker";
import { generateTag } from "@test/fakes/Tag";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateAudioEventImportFile } from "@test/fakes/AudioEventImportFile";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { nStepObservable } from "@test/helpers/general";
import { fakeAsync, flush } from "@angular/core/testing";
import { getElementByTextContent } from "@test/helpers/html";
import { Sorting } from "@baw-api/baw-api.service";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { AudioEventProvenanceService } from "@baw-api/AudioEventProvenance/AudioEventProvenance.service";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { verificationRoute } from "@components/annotations/annotation.routes";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { AnnotationImportDetailsComponent } from "./details.component";

describe("AnnotationsDetailsComponent", () => {
  let spec: SpectatorRouting<AnnotationImportDetailsComponent>;

  let ngbNavConfig: SpyObject<NgbNavConfig>;
  let injector: SpyObject<AssociationInjector>;
  let mockTagsService: SpyObject<TagsService>;
  let mockEventsService: SpyObject<ShallowAudioEventsService>;
  let mockAudioEventImportService: SpyObject<AudioEventImportService>;
  let mockAudioEventFileService: SpyObject<AudioEventImportFileService>;
  let mockRecordingsService: SpyObject<AudioRecordingsService>;
  let mockProvenanceService: SpyObject<AudioEventProvenanceService>;

  let mockAudioEventImport: AudioEventImport;
  let mockTagModel: Tag;
  let mockAudioEvents: AudioEvent[];
  let mockProvenance: AudioEventProvenance;
  let mockAudioEventImportFiles: AudioEventImportFile[];
  let mockAudioRecording: AudioRecording;
  let mockProject: Project;

  let expectedAudioEventTable: any;
  let expectedFilesTable: any;

  const fileVerifyLinks = () => spec.queryAll(StrongRouteDirective);

  const createComponent = createRoutingFactory({
    component: AnnotationImportDetailsComponent,
    imports: [InlineListComponent, LoadingComponent],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
  });

  function fileTabButton(): Element | null {
    const fileTabs = spec.queryAll(".nav-link");
    for (const tab of fileTabs) {
      if (tab.textContent === "Files") {
        return tab;
      }
    }

    return null;
  }

  function activeTabContent(): Element | null {
    return spec.query(".tab-content");
  }

  function switchToFileTab(): void {
    const target = fileTabButton();
    spec.click(target);

    flush();
    spec.detectChanges();
  }

  function deleteFirstFile() {
    const deleteButton = getElementByTextContent(spec, "Delete");
    spec.click(deleteButton);

    const confirmationButton = spec.query<HTMLButtonElement>(
      "baw-harvest-confirmation-modal #next-btn",
      { root: true },
    );
    spec.click(confirmationButton);
    flush();
  }

  async function setup(): Promise<void> {
    spec = createComponent({
      detectChanges: false,
      data: {
        resolvers: {
          audioEventImport: "audioEventImport",
          project: "project",
        },
        audioEventImport: {
          model: mockAudioEventImport,
        },
        project: {
          model: mockProject,
        },
      },
    });

    // I disable the nab menu/tab animations because it makes writing tests
    // harder and has the potential to break tests if the upstream animation
    // changes
    ngbNavConfig = spec.inject(NgbNavConfig);
    ngbNavConfig.animation = false;

    injector = spec.inject(ASSOCIATION_INJECTOR);
    mockAudioEventImport["injector"] = injector;
    mockProject["injector"] = injector;

    mockAudioRecording = new AudioRecording(generateAudioRecording(), injector);

    mockTagModel = new Tag(generateTag(), injector);

    mockAudioEvents = modelData.randomArray(
      1,
      10,
      () => new AudioEvent(generateAudioEvent(), injector),
    );
    mockAudioEvents.forEach((event) =>
      event.addMetadata(
        modelData.model.generatePagingMetadata({
          items: mockAudioEvents.length,
        }),
      ),
    );

    mockProvenance = new AudioEventProvenance(
      generateAudioEventProvenance(),
      injector,
    );

    mockAudioEventImportFiles = modelData.randomArray(
      1,
      10,
      () => new AudioEventImportFile(generateAudioEventImportFile(), injector),
    );
    mockAudioEventImportFiles.forEach((file) =>
      file.addMetadata(
        modelData.model.generatePagingMetadata({
          items: mockAudioEventImportFiles.length,
        }),
      ),
    );

    mockRecordingsService = spec.inject(AUDIO_RECORDING.token);
    mockRecordingsService.show.and.callFake(() => of(mockAudioRecording));

    mockAudioEventFileService = spec.inject(AUDIO_EVENT_IMPORT_FILE.token);
    mockAudioEventFileService.list.and.callFake(() =>
      of(mockAudioEventImportFiles),
    );
    mockAudioEventFileService.filter.and.callFake(() =>
      of(mockAudioEventImportFiles),
    );
    mockAudioEventFileService.destroy.andReturn(of());

    mockAudioEventImportService = spec.inject(AUDIO_EVENT_IMPORT.token);
    mockAudioEventImportService.show.and.callFake(() =>
      of(mockAudioEventImport),
    );

    const audioEventSubject = new Subject<AudioEventImport>();
    const tagsSubject = new Subject<Tag[]>();
    const provenanceSubject = new Subject<AudioEventProvenance>();

    const promise = Promise.all([
      nStepObservable(audioEventSubject, () => mockAudioEvents as any),
      nStepObservable(tagsSubject, () => mockTagModel as any),
      nStepObservable(provenanceSubject, () => mockProvenance as any),
    ]);

    mockEventsService = spec.inject(SHALLOW_AUDIO_EVENT.token);
    mockEventsService.filter.and.callFake(() => audioEventSubject);

    mockTagsService = spec.inject(TAG.token);
    mockTagsService.show.and.callFake(() => tagsSubject);

    mockProvenanceService = spec.inject(AUDIO_EVENT_PROVENANCE.token);
    mockProvenanceService.show.and.callFake(() => provenanceSubject);

    // When deleting a file, we use a modal to confirm that the user wants to
    // delete the file.
    // By disabling the modal animation, we don't have to (fake) async await for
    // the modal to open during testing.
    const modalConfigService = spec.inject(NgbModalConfig);
    modalConfigService.animation = false;

    // without mocking the timezone, tests that assert time will fail in CI
    // and other timezones that are not the same as the developers local timezone (UTC+8)
    const mockUserTimeZone = "Australia/Perth"; // +08:00 UTC
    Settings.defaultZone = mockUserTimeZone;

    spec.detectChanges();
    await promise;
    spec.detectChanges();

    expectedAudioEventTable = mockAudioEvents.map((event) => ({
      "Audio Recording": event.audioRecording?.id?.toString(),
      "Created At": event.createdAt?.toFormat("yyyy-MM-dd HH:mm:ss"),
      Tags: mockTagModel.text,
      Provenance: mockProvenance.name,
      Actions: "",
    }));
  }

  beforeEach(async () => {
    mockAudioEventImport = new AudioEventImport(generateAudioEventImport());
    mockProject = new Project(generateProject());
    await setup();
  });

  assertPageInfo<AudioEventImport>(
    AnnotationImportDetailsComponent,
    "test name",
    {
      audioEventImport: {
        model: new AudioEventImport(
          generateAudioEventImport({ name: "test name" }),
        ),
      },
    },
  );

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(AnnotationImportDetailsComponent);
  });

  it("should not emit a file filter until the tab is clicked", fakeAsync(() => {
    expect(mockAudioEventFileService.filter).not.toHaveBeenCalled();

    switchToFileTab();

    expect(mockAudioEventFileService.filter).toHaveBeenCalledOnceWith(
      jasmine.objectContaining({
        paging: { page: 1 },
      }),
      mockAudioEventImport,
    );
  }));

  describe("audio event table", () => {
    assertDatatable(() => ({
      columns: () => [
        "Audio Recording",
        "Created At",
        "Tags",
        "Provenance",
        "Actions",
      ],
      rows: () => expectedAudioEventTable,
      root: () => activeTabContent(),
    }));

    it("should make one correct api request on load", () => {
      expect(mockEventsService.filter).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          paging: { page: 1 },
        }),
      );
    });
  });

  describe("file table", () => {
    beforeEach(fakeAsync(() => {
      switchToFileTab();

      expectedFilesTable = mockAudioEventImportFiles.map((file) => ({
        "File Name": file.name,
        "Date Imported": file.createdAt?.toFormat("yyyy-MM-dd HH:mm:ss"),
        "Additional Tags": "No associated tags",
        Actions: "",
      }));
    }));

    assertDatatable(() => ({
      service: mockAudioEventFileService,
      columns: () => [
        "Id",
        "File Name",
        "Date Imported",
        "Additional Tags",
        "Actions",
      ],
      rows: () => expectedFilesTable,
      root: () => activeTabContent(),
    }));

    it("should make the correct api requests to delete a file", fakeAsync(() => {
      deleteFirstFile();
      expect(mockAudioEventFileService.destroy).toHaveBeenCalledTimes(1);
    }));

    it("should refresh the files table after deleting a file", fakeAsync(() => {
      // We first sort the files table by "File Name" column, to ensure that
      // the re-fetch request maintains the same sorting conditions.
      const fileNameColumn = spec.query(".datatable-header-cell-template-wrap");
      const sortingHandle = fileNameColumn.querySelector(".sort-btn");
      spec.click(sortingHandle);

      const expectedSortingFilters: Sorting<keyof AudioEventImportFile> = {
        direction: "asc",
        orderBy: "id",
      };
      expect(mockAudioEventFileService.filter).toHaveBeenCalledWith(
        jasmine.objectContaining({
          sorting: expectedSortingFilters,
        }),
        jasmine.any(AudioEventImport),
      );

      deleteFirstFile();

      expect(mockAudioEventFileService.filter).toHaveBeenCalledWith(
        jasmine.objectContaining({
          sorting: expectedSortingFilters,
        }),
        jasmine.any(AudioEventImport),
      );
    }));

    it("should have the correct 'verify' link", () => {
      const expectedLinks = mockAudioEventImportFiles.map(
        (file: AudioEventImportFile) => {
          const routeParams = { projectId: mockProject.id };
          const queryParams = { importFiles: file.id };
          return { routeParams, queryParams };
        },
      );

      const verificationLinks = fileVerifyLinks();
      verificationLinks.forEach((link, i: number) => {
        const expectedResult = expectedLinks[i];

        expect(link).toHaveStrongRoute(verificationRoute.project);

        expect(link.routeParams).toEqual(expectedResult.routeParams);
        expect(link.queryParams).toEqual(expectedResult.queryParams);
      });
    });
  });
});
