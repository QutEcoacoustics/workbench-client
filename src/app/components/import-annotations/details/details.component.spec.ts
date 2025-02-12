import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastrService } from "ngx-toastr";
import { AudioEventImport } from "@models/AudioEventImport";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { TagsService } from "@baw-api/tag/tags.service";
import { Tag } from "@models/Tag";
import { of } from "rxjs";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import {
  AUDIO_EVENT_IMPORT,
  AUDIO_EVENT_IMPORT_FILE,
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
import { AnnotationImportDetailsComponent } from "./details.component";

describe("AnnotationsDetailsComponent", () => {
  let spectator: SpectatorRouting<AnnotationImportDetailsComponent>;

  let injector: SpyObject<AssociationInjector>;
  let mockTagsService: SpyObject<TagsService>;
  let mockEventsService: SpyObject<ShallowAudioEventsService>;
  let mockAudioEventImportService: SpyObject<AudioEventImportService>;
  let mockAudioEventFileService: SpyObject<AudioEventImportFileService>;

  let mockAudioEventImport: AudioEventImport;
  let mockTagModels: Tag[];
  let mockAudioEvents: AudioEvent[];
  let mockAudioEventImportFiles: AudioEventImportFile[];

  const createComponent = createRoutingFactory({
    component: AnnotationImportDetailsComponent,
    declarations: [InlineListComponent, LoadingComponent],
    imports: [SharedModule, MockBawApiModule],
    mocks: [ToastrService],
  });

  // function fileTabButton(): Element | null{
  //   const fileTabs = spectator.queryAll(".nav-link");
  //   for (const tab of fileTabs) {
  //     if (tab.textContent === "Files") {
  //       return tab;
  //     }
  //   }

  //   return null;
  // }

  function activeTabContent(): Element | null {
    return spectator.query(".tab-content");
  }

  function setup(): void {
    spectator = createComponent({
      detectChanges: false,
      data: {
        audioEventImport: {
          model: mockAudioEventImport,
        },
      },
    });

    injector = spectator.inject(ASSOCIATION_INJECTOR);
    mockAudioEventImport["injector"] = injector;

    mockTagModels = [];
    mockAudioEvents = [];
    mockAudioEventImportFiles = [];

    mockTagsService = spectator.inject(TAG.token);
    mockTagsService.filter.and.callFake(() => of(mockTagModels));

    mockEventsService = spectator.inject(SHALLOW_AUDIO_EVENT.token);
    mockEventsService.filter.and.callFake(() => of(mockAudioEvents));

    mockAudioEventFileService = spectator.inject(AUDIO_EVENT_IMPORT_FILE.token);
    mockAudioEventFileService.list.and.callFake(() =>
      of(mockAudioEventImportFiles)
    );
    mockAudioEventFileService.filter.and.callFake(() =>
      of(mockAudioEventImportFiles)
    );

    mockAudioEventImportService = spectator.inject(AUDIO_EVENT_IMPORT.token);
    mockAudioEventImportService.show.and.callFake(() =>
      of(mockAudioEventImport)
    );

    // without mocking the timezone, tests that assert time will fail in CI
    // and other timezones that are not the same as the developers local timezone (UTC+8)
    const mockUserTimeZone = "Australia/Perth"; // +08:00 UTC
    Settings.defaultZone = mockUserTimeZone;

    spectator.detectChanges();
  }

  beforeEach(() => {
    mockAudioEventImport = new AudioEventImport(generateAudioEventImport());
    setup();
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
    expect(spectator.component).toBeInstanceOf(
      AnnotationImportDetailsComponent
    );
  });

  describe("audio event table", () => {
    assertDatatable(() => ({
      service: mockEventsService,
      columns: ["Audio Recording", "Created At", "Tags", "Actions"],
      rows: [],
      root: () => activeTabContent(),
    }));
  });

  // describe("file table", () => {
  //   beforeEach(() => {
  //     const target = fileTabButton();
  //     if (target === null) {
  //       throw new Error("Could not find file tab");
  //     }

  //     spectator.click(target);
  //   });

  //   assertDatatable(() => ({
  //     service: mockAudioEventFileService,
  //     columns: ["File Name", "Date Imported", "Additional Tags", "Actions"],
  //     rows: [],
  //     root: () => activeTabContent(),
  //   }));
  // });
});
