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
import { NgbNavConfig } from "@ng-bootstrap/ng-bootstrap";
import { modelData } from "@test/helpers/faker";
import { generateTag } from "@test/fakes/Tag";
import { generateAudioEvent } from "@test/fakes/AudioEvent";
import { generateAudioEventImportFile } from "@test/fakes/AudioEventImportFile";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { nStepObservable } from "@test/helpers/general";
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

  let mockAudioEventImport: AudioEventImport;
  let mockTagModel: Tag;
  let mockAudioEvents: AudioEvent[];
  let mockAudioEventImportFiles: AudioEventImportFile[];
  let mockAudioRecording: AudioRecording;

  let expectedAudioEventTable: any;

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
  }

  async function setup(): Promise<void> {
    spec = createComponent({
      detectChanges: false,
      data: {
        audioEventImport: {
          model: mockAudioEventImport,
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

    mockAudioRecording = new AudioRecording(generateAudioRecording(), injector);

    mockTagModel = new Tag(generateTag(), injector);

    mockAudioEvents = modelData.randomArray(
      1,
      10,
      () => new AudioEvent(generateAudioEvent(), injector)
    );
    mockAudioEvents.forEach((event) =>
      event.addMetadata(
        modelData.model.generatePagingMetadata({
          items: mockAudioEvents.length,
        })
      )
    );

    mockAudioEventImportFiles = modelData.randomArray(
      1,
      10,
      () => new AudioEventImportFile(generateAudioEventImportFile(), injector)
    );
    mockAudioEventImportFiles.forEach((file) =>
      file.addMetadata(
        modelData.model.generatePagingMetadata({
          items: mockAudioEventImportFiles.length,
        })
      )
    );

    mockRecordingsService = spec.inject(AUDIO_RECORDING.token);
    mockRecordingsService.show.and.callFake(() => of(mockAudioRecording));

    mockAudioEventFileService = spec.inject(AUDIO_EVENT_IMPORT_FILE.token);
    mockAudioEventFileService.list.and.callFake(() =>
      of(mockAudioEventImportFiles)
    );
    mockAudioEventFileService.filter.and.callFake(() =>
      of(mockAudioEventImportFiles)
    );

    mockAudioEventImportService = spec.inject(AUDIO_EVENT_IMPORT.token);
    mockAudioEventImportService.show.and.callFake(() =>
      of(mockAudioEventImport)
    );

    const audioEventSubject = new Subject<AudioEventImport>();
    const tagsSubject = new Subject<Tag[]>();

    const promise = Promise.all([
      nStepObservable(audioEventSubject, () => mockAudioEvents as any),
      nStepObservable(tagsSubject, () => mockTagModel as any),
    ]);

    mockEventsService = spec.inject(SHALLOW_AUDIO_EVENT.token);
    mockEventsService.filter.and.callFake(() => audioEventSubject);

    mockTagsService = spec.inject(TAG.token);
    mockTagsService.show.and.callFake(() => tagsSubject);

    // without mocking the timezone, tests that assert time will fail in CI
    // and other timezones that are not the same as the developers local timezone (UTC+8)
    const mockUserTimeZone = "Australia/Perth"; // +08:00 UTC
    Settings.defaultZone = mockUserTimeZone;

    spec.detectChanges();
    await promise;
    spec.detectChanges();

    expectedAudioEventTable = mockAudioEvents.map((event) => ({
      "Audio Recording": event.audioRecording?.id.toString(),
      "Created At": event.createdAt?.toFormat("yyyy-MM-dd HH:mm:ss"),
      Tags: mockTagModel.text,
      Actions: "",
    }));
  }

  beforeEach(async () => {
    mockAudioEventImport = new AudioEventImport(generateAudioEventImport());
    await setup();
  });

  assertPageInfo<AudioEventImport>(
    AnnotationImportDetailsComponent,
    "test name",
    {
      audioEventImport: {
        model: new AudioEventImport(
          generateAudioEventImport({ name: "test name" })
        ),
      },
    }
  );

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(AnnotationImportDetailsComponent);
  });

  describe("audio event table", () => {
    assertDatatable(() => ({
      columns: () => ["Audio Recording", "Created At", "Tags", "Actions"],
      rows: () => expectedAudioEventTable,
      root: () => activeTabContent(),
    }));

    it("should make one correct api request on load", () => {
      expect(mockEventsService.filter).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          paging: { page: 1 },
        })
      );
    });
  });

  describe("file table", () => {
    it("should not emit a filter event until the tab is clicked", () => {
      expect(mockAudioEventFileService.filter).not.toHaveBeenCalled();

      switchToFileTab();

      expect(mockAudioEventFileService.filter).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({
          paging: { page: 1 },
        }),
        mockAudioEventImport
      );
    });

    xdescribe("after switching to file tab", () => {
      beforeEach(() => {
        switchToFileTab();
      });

      assertDatatable(() => ({
        service: mockAudioEventFileService,
        columns: () => [
          "File Name",
          "Date Imported",
          "Additional Tags",
          "Actions",
        ],
        rows: () => [],
        root: () => activeTabContent(),
      }));
    });
  });
});
