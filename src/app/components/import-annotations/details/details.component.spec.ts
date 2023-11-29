import {
  SpectatorRouting,
  SpyObject,
  createRoutingFactory,
} from "@ngneat/spectator";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { ToastrService } from "ngx-toastr";
import { AudioEventImport, IAudioEventImport } from "@models/AudioEventImport";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { Injector } from "@angular/core";
import {
  AudioEventImportFileRead,
  IAudioEventImportFileRead,
} from "@models/AudioEventImport/AudioEventImportFileRead";
import { TagsService } from "@baw-api/tag/tags.service";
import { Tag } from "@models/Tag";
import { of } from "rxjs";
import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
import { AudioEvent } from "@models/AudioEvent";
import {
  AUDIO_EVENT_IMPORT,
  SHALLOW_AUDIO_EVENT,
  TAG,
} from "@baw-api/ServiceTokens";
import { modelData } from "@test/helpers/faker";
import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
import {
  AudioEventImportFileWrite,
  IAudioEventImportFileWrite,
} from "@models/AudioEventImport/AudioEventImportFileWrite";
import { DateTime, Settings } from "luxon";
import { Id } from "@interfaces/apiInterfaces";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { Filters } from "@baw-api/baw-api.service";
import { LoadingComponent } from "@shared/loading/loading.component";
import { fakeAsync, flush, tick } from "@angular/core/testing";
import { AnnotationsDetailsComponent } from "./details.component";

describe("AnnotationsDetailsComponent", () => {
  let spectator: SpectatorRouting<AnnotationsDetailsComponent>;

  let injector: SpyObject<Injector>;
  let mockTagsService: SpyObject<TagsService>;
  let mockEventsService: SpyObject<ShallowAudioEventsService>;
  let mockAudioEventImportService: SpyObject<AudioEventImportService>;

  let mockAudioEventImport: AudioEventImport;
  let mockTagModels: Tag[];
  let mockAudioEvents: AudioEvent[];

  const createComponent = createRoutingFactory({
    component: AnnotationsDetailsComponent,
    declarations: [
      InlineListComponent,
      TypeaheadInputComponent,
      LoadingComponent,
    ],
    imports: [SharedModule, MockBawApiModule],
    mocks: [ToastrService],
  });

  function setup(): void {
    spectator = createComponent({
      detectChanges: false,
      data: {
        audioEventImport: {
          model: mockAudioEventImport,
        },
      },
    });

    injector = spectator.inject(Injector);
    mockAudioEventImport["injector"] = injector;

    mockAudioEventImport.files.map(
      (fileModel: AudioEventImportFileRead) =>
        (fileModel["injector"] = injector)
    );

    mockTagModels = [];
    mockAudioEvents = [];

    mockTagsService = spectator.inject(TAG.token);
    mockTagsService.filter.and.callFake(() => of(mockTagModels));

    mockEventsService = spectator.inject(SHALLOW_AUDIO_EVENT.token);
    mockEventsService.filter.and.callFake(() => of(mockAudioEvents));

    mockAudioEventImportService = spectator.inject(AUDIO_EVENT_IMPORT.token);
    mockAudioEventImportService.importFile = jasmine.createSpy(
      "importFile"
    ) as any;
    mockAudioEventImportService.importFile.and.callFake(() =>
      of(mockAudioEventImport)
    );
    mockAudioEventImportService.show = jasmine.createSpy("show") as any;
    mockAudioEventImportService.show.and.callFake(() =>
      of(mockAudioEventImport)
    );

    // without mocking the timezone, tests that assert time will fail in CI
    // and other timezones that are not the same as the developers local timezone (UTC+8)
    const mockUserTimeZone = "Australia/Perth"; // +08:00 UTC
    Settings.defaultZone = mockUserTimeZone;

    spectator.detectChanges();
  }

  function getElementByInnerText<T extends HTMLElement>(text: string): T {
    return spectator.debugElement.query(
      (element) => element.nativeElement.innerText === text
    )?.nativeElement as T;
  }

  function addFileToImportGroup(index: number, file: File): void {
    const requestedInputElement = getFileInputElement(index);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    requestedInputElement.files = dataTransfer.files;

    requestedInputElement.dispatchEvent(new Event("change"));
    spectator.detectChanges();
  }

  function addFileCollectionToImportGroup(index: number, files: File[]): void {
    const requestedInputElement = getFileInputElement(index);

    const dataTransfer = new DataTransfer();
    files.forEach((file) => dataTransfer.items.add(file));
    requestedInputElement.files = dataTransfer.files;

    requestedInputElement.dispatchEvent(new Event("change"));
    spectator.detectChanges();
  }

  // typeahead input functionality is tested in the typeahead component
  // therefore, I don't want to reimplement the mocks and tests here
  // I am therefore going to add the tag id directly to the import group
  function addAnnotationsToImportGroup(index: number, tagIds: Id[]): void {
    spectator.component.importGroups[index].additionalTagIds = tagIds;
    spectator.detectChanges();
  }

  function removeImportGroup(index: number): void {
    const removeButton = getRemoveInputGroupButton(index);
    removeButton.click();
    spectator.detectChanges();
  }

  function fileToImportGroup(
    file: File,
    data?: Partial<IAudioEventImportFileWrite>
  ): AudioEventImportFileWrite {
    return new AudioEventImportFileWrite({
      id: mockAudioEventImport.id,
      file,
      additionalTagIds: [],
      commit: true,
      ...data,
    });
  }

  function generateMockFile(): File {
    return new File(
      [modelData.descriptionLong()],
      modelData.system.commonFileName("csv")
    );
  }

  function generateMockAudioEventImport(
    data?: Partial<IAudioEventImport>
  ): AudioEventImport {
    const mockNewAudioEventImport: AudioEventImport = new AudioEventImport(
      generateAudioEventImport(data)
    );
    mockNewAudioEventImport["injector"] = injector;
    mockNewAudioEventImport.files.map(
      (fileModel: AudioEventImportFileRead) =>
        (fileModel["injector"] = injector)
    );

    return mockNewAudioEventImport;
  }

  const getImportGroupElements = (): HTMLElement[] =>
    spectator.queryAll(".import-group");
  const getFileInputElement = (index: number): HTMLInputElement =>
    spectator.queryAll<HTMLInputElement>("input[type='file']")[index];
  const getRemoveInputGroupButton = (index: number): HTMLButtonElement =>
    spectator.queryAll<HTMLButtonElement>(".remove-import-group-button")[index];
  const importAllButton = (): HTMLButtonElement =>
    spectator.query("button[type='submit']");

  beforeEach(() => {
    mockAudioEventImport = new AudioEventImport(generateAudioEventImport());
    setup();
  });

  assertPageInfo<AudioEventImport>(AnnotationsDetailsComponent, "test name", {
    audioEventImport: {
      model: new AudioEventImport(
        generateAudioEventImport({ name: "test name" })
      ),
    },
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AnnotationsDetailsComponent);
  });

  it("should make one correct audio event request", () => {
    const expectedFilters = {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      filter: { audio_event_import_id: { eq: mockAudioEventImport.id } },
      sorting: { direction: "desc", orderBy: "createdAt" },
      paging: { page: 1 },
    };

    expect(mockEventsService.filter).toHaveBeenCalledOnceWith(expectedFilters);
  });

  it("should have an empty import group if no files are imported", () => {
    const importGroupElements: HTMLElement[] = getImportGroupElements();
    expect(importGroupElements).toHaveLength(1);
  });

  // in this test, we are creating three populated import groups
  // therefore there should be four editable import groups
  it("should create a new import group if all import groups have files", () => {
    addFileToImportGroup(0, generateMockFile());
    addFileToImportGroup(1, generateMockFile());
    addFileToImportGroup(2, generateMockFile());

    expect(getImportGroupElements()).toHaveLength(4);
  });

  it("should use the correct import group number for a new import group", () => {
    const expectedImportGroupName = "Import Group 2";

    expect(getElementByInnerText(expectedImportGroupName)).not.toExist();
    addFileToImportGroup(0, generateMockFile());
    expect(getElementByInnerText(expectedImportGroupName)).toExist();
  });

  it("should make the correct api calls when one import group is imported to the api", fakeAsync(() => {
    const mockFile: File = generateMockFile();
    const mockFileWriteModel: AudioEventImportFileWrite =
      fileToImportGroup(mockFile);

    addFileToImportGroup(0, mockFile);

    // because an api call is made during the dry run, we want to make sure that we don't pass the test using the dry run call
    // therefore we reset the api call spy so that this test will fail if dry runs work, but wet imports do not
    mockAudioEventImportService.importFile.calls.reset();
    const importAllButtonElement: HTMLButtonElement = importAllButton();
    importAllButtonElement.click();

    tick();
    spectator.detectChanges();

    expect(mockAudioEventImportService.importFile).toHaveBeenCalledOnceWith(
      mockFileWriteModel
    );
  }));

  it("should make the correct api calls when multiple import groups are imported to the api", fakeAsync(() => {
    const mockFiles: File[] = modelData.randomArray(4, 10, () =>
      generateMockFile()
    );

    mockFiles.forEach((file: File, i: number) => {
      addFileToImportGroup(i, file);
    });

    // because an api call is made during the dry run, we want to make sure that we don't pass the test using the dry run call
    // therefore we reset the api call spy so that this test will fail if dry runs work, but wet imports do not
    mockAudioEventImportService.importFile.calls.reset();
    const importAllButtonElement: HTMLButtonElement = importAllButton();
    importAllButtonElement.click();

    // because uploads wait for each other with promises, flushing the zone will cause all the promises to resolve
    flush();
    spectator.detectChanges();

    // this test is supposed to fail if the empty import group is imported to the api
    expect(mockAudioEventImportService.importFile).toHaveBeenCalledTimes(
      mockFiles.length
    );

    mockFiles.forEach((file: File) => {
      const mockFileWriteModel: AudioEventImportFileWrite =
        fileToImportGroup(file);

      expect(mockAudioEventImportService.importFile).toHaveBeenCalledWith(
        mockFileWriteModel
      );

      // because the different property of each object is the file, we can check that the name of the file is not in the api call
      // without doing this, it will compare the top level properties of the object, causing the test to not fail/fail incorrectly
      expect(mockAudioEventImportService.importFile).toHaveBeenCalledWith(
        jasmine.objectContaining({ file })
      );
    });
  }));

  it("should update the event table when an import group is imported", fakeAsync(() => {
    const importAllButtonElement: HTMLButtonElement = importAllButton();
    const expectedFilters = {
      filter: { audio_event_import_id: { eq: mockAudioEventImport.id } },
      sorting: { direction: "desc", orderBy: "createdAt" },
      paging: { page: 1 },
    } as Filters<AudioEventImport>;

    // since the events service is called on initial load
    // therefore, we need to reset the call count so that we can isolate that the import caused the new call
    mockEventsService.filter.calls.reset();

    // import the import import group
    addFileToImportGroup(0, generateMockFile());
    importAllButtonElement.click();

    tick();
    spectator.detectChanges();

    expect(mockEventsService.filter).toHaveBeenCalledWith(expectedFilters);
  }));

  it("should update the files table when an import group is imported", fakeAsync(() => {
    const importAllButtonElement: HTMLButtonElement = importAllButton();

    const newAudioEventImport = generateMockAudioEventImport();

    mockAudioEventImportService.show.calls.reset();
    mockAudioEventImportService.show.and.returnValue(of(newAudioEventImport));

    addFileToImportGroup(0, generateMockFile());
    importAllButtonElement.click();

    tick();
    spectator.detectChanges();

    expect(spectator.component.audioEventImport).toEqual(newAudioEventImport);
  }));

  it("should not include a removed import group when importing to the api", fakeAsync(() => {
    const mockFiles: File[] = modelData.randomArray(5, 5, () =>
      generateMockFile()
    );

    mockFiles.forEach((file: File, i: number) => {
      addFileToImportGroup(i, file);
    });

    // remove the second last import group
    removeImportGroup(mockFiles.length - 2);
    const removedFile: File = mockFiles.splice(mockFiles.length - 2, 1)[0];

    mockAudioEventImportService.importFile.calls.reset();
    const importAllButtonElement: HTMLButtonElement = importAllButton();
    importAllButtonElement.click();

    tick();
    spectator.detectChanges();

    // assert that the removed import group was not imported to the api
    expect(mockAudioEventImportService.importFile).not.toHaveBeenCalledWith(
      jasmine.objectContaining({
        file: jasmine.objectContaining({
          name: removedFile.name,
        }),
      })
    );

    // assert that all the other import groups that were not removed were imported to the api
    mockFiles.forEach((file: File) => {
      expect(mockAudioEventImportService.importFile).toHaveBeenCalledWith(
        fileToImportGroup(file)
      );

      expect(mockAudioEventImportService.importFile).toHaveBeenCalledWith(
        jasmine.objectContaining({ file })
      );
    });
  }));

  it("should use a local dateTime format for events table rows", () => {
    const importedAt = DateTime.fromISO("2022-11-04T20:12:31.000Z");
    // relative to UTC+8
    const expectedDateTime = "2022-11-05 04:12:31";

    // we use the interface here because we are using it as a sub-model on the AudioEventImport constructor
    // this means that the mockImportedFile will be called with the AudioEventImportFileRead constructor
    const mockImportedFile: IAudioEventImportFileRead = {
      name: modelData.system.commonFileName("csv"),
      importedAt,
      additionalTags: [],
    };

    mockAudioEventImport = new AudioEventImport(
      generateAudioEventImport({
        files: [mockImportedFile],
      })
    );

    mockAudioEventImport["injector"] = injector;

    mockAudioEventImport.files.map(
      (fileModel: AudioEventImportFileRead) =>
        (fileModel["injector"] = injector)
    );

    spectator.component.audioEventImport = mockAudioEventImport;

    spectator.detectChanges();

    const importedAtColumn =
      getElementByInnerText<HTMLTableCellElement>(expectedDateTime);

    expect(importedAtColumn).toExist();
  });

  it("should use a local dateTime format for the file table rows", () => {
    const importedAt = DateTime.fromISO("2022-11-04T20:12:31.000Z");
    // relative to UTC+8
    const expectedDateTime = "2022-11-05 04:12:31";

    // we use the interface here because we are using it as a sub-model on the AudioEventImport constructor
    // this means that the mockImportedFile will be called with the AudioEventImportFileRead constructor
    const mockImportedFile: IAudioEventImportFileRead = {
      name: modelData.system.commonFileName("csv"),
      importedAt,
      additionalTags: [],
    };

    mockAudioEventImport = new AudioEventImport(
      generateAudioEventImport({
        files: [mockImportedFile],
      })
    );

    mockAudioEventImport["injector"] = injector;

    mockAudioEventImport.files.map(
      (fileModel: AudioEventImportFileRead) =>
        (fileModel["injector"] = injector)
    );

    spectator.component.audioEventImport = mockAudioEventImport;

    spectator.detectChanges();

    const importedAtColumn =
      getElementByInnerText<HTMLTableCellElement>(expectedDateTime);

    expect(importedAtColumn).toExist();
  });

  it("should perform a dry run of an import when a file is added", () => {
    const mockFile: File = generateMockFile();
    const mockFileWriteModel: AudioEventImportFileWrite = fileToImportGroup(
      mockFile,
      { commit: false }
    );

    addFileToImportGroup(0, mockFile);
    expect(mockAudioEventImportService.importFile).toHaveBeenCalledOnceWith(
      mockFileWriteModel
    );
  });

  it("should make the correct dry run calls for multiple event groups", fakeAsync(() => {
    const mockFiles: File[] = modelData.randomArray(4, 10, () =>
      generateMockFile()
    );

    mockFiles.forEach((file: File, i: number) => {
      addFileToImportGroup(i, file);

      expect(mockAudioEventImportService.importFile).toHaveBeenCalledWith(
        jasmine.objectContaining({ file })
      );
    });

    expect(mockAudioEventImportService.importFile).toHaveBeenCalledTimes(
      mockFiles.length
    );
  }));

  it("should perform a dry run correctly for a single event group with multiple files", () => {
    const mockFiles: File[] = modelData.randomArray(4, 10, () =>
      generateMockFile()
    );

    addFileCollectionToImportGroup(0, mockFiles);

    mockFiles.forEach((file: File) => {
      expect(mockAudioEventImportService.importFile).toHaveBeenCalledWith(
        jasmine.objectContaining({ file })
      );
    });

    expect(mockAudioEventImportService.importFile).toHaveBeenCalledTimes(
      mockFiles.length
    );
  });

  it("should not display a remove button for an import group with no files", () => {
    // we want to add a new import group and assert that the empty import group does not include a remove button
    addFileToImportGroup(0, generateMockFile());
    const removeButtons: HTMLButtonElement[] =
      spectator.queryAll<HTMLButtonElement>(".remove-import-group-button");
    expect(removeButtons).toHaveLength(1);
  });

  it("should remove an import group if the 'Remove' button is clicked", () => {
    addFileToImportGroup(0, generateMockFile());
    expect(getImportGroupElements()).toHaveLength(2);

    removeImportGroup(0);

    expect(getImportGroupElements()).toHaveLength(1);
  });

  it("should disable the 'import All' button when there is an error in an import group", () => {
    const fakeErrors: string[] = ["audio_recording_id must be greater than 0"];

    addFileToImportGroup(0, generateMockFile());

    spectator.component.importGroups[0].errors = fakeErrors;
    spectator.detectChanges();

    expect(importAllButton()).toBeDisabled();
  });

  it("should not have the 'import All' button disabled if there are no errors in any import group", () => {
    addFileToImportGroup(0, generateMockFile());
    expect(importAllButton()).not.toBeDisabled();
  });

  it("should have the 'import All' button disabled if there are no import groups with files", () => {
    expect(importAllButton()).toBeDisabled();
  });

  it("should import import groups correctly to the api when a file and associated tags are added", fakeAsync(() => {
    const mockFile: File = generateMockFile();
    const mockAssociatedTags: Id[] = modelData.randomArray(2, 5, () =>
      modelData.id()
    );

    const mockFileWriteModel: AudioEventImportFileWrite = fileToImportGroup(
      mockFile,
      { additionalTagIds: mockAssociatedTags }
    );

    addFileToImportGroup(0, mockFile);
    addAnnotationsToImportGroup(0, mockAssociatedTags);

    // because an api call is made during the dry run, we want to make sure that we don't pass the test using the dry run call
    // therefore we reset the api call spy so that this test will fail if dry runs work, but wet imports do not
    mockAudioEventImportService.importFile.calls.reset();
    const importAllButtonElement: HTMLButtonElement = importAllButton();
    importAllButtonElement.click();

    tick();
    spectator.detectChanges();

    expect(mockAudioEventImportService.importFile).toHaveBeenCalledOnceWith(
      mockFileWriteModel
    );

    expect(mockAudioEventImportService.importFile).toHaveBeenCalledWith(
      jasmine.objectContaining({
        file: mockFile,
        additionalTagIds: mockAssociatedTags,
      })
    );
  }));

  it("should disable the form inputs when an import is in progress", () => {
    const mockFiles: File[] = modelData.randomArray(4, 10, () =>
      generateMockFile()
    );

    mockFiles.forEach((file: File, i: number) => {
      addFileToImportGroup(i, file);
    });

    // assert that the form is not disabled before the import is started
    expect(spectator.component.uploading).toBeFalse();

    // we don't perform an async tick here because that would cause the fake api responses to be returned, enabling the import form
    importAllButton().click();
    spectator.detectChanges();

    expect(spectator.component.uploading).toBeTrue();
    expect(importAllButton()).toBeDisabled();

    mockFiles.forEach((_, i: number) => {
      expect(getRemoveInputGroupButton(i)).toBeDisabled();
      expect(getFileInputElement(i)).toBeDisabled();
    });
  });
});
