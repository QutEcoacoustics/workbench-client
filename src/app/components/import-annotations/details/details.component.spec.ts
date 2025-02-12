// import {
//   SpectatorRouting,
//   SpyObject,
//   createRoutingFactory,
// } from "@ngneat/spectator";
// import { SharedModule } from "@shared/shared.module";
// import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
// import { assertPageInfo } from "@test/helpers/pageRoute";
// import { ToastrService } from "ngx-toastr";
// import { AudioEventImport, IAudioEventImport } from "@models/AudioEventImport";
// import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
// import { TagsService } from "@baw-api/tag/tags.service";
// import { Tag } from "@models/Tag";
// import { of } from "rxjs";
// import { ShallowAudioEventsService } from "@baw-api/audio-event/audio-events.service";
// import { AudioEvent } from "@models/AudioEvent";
// import {
//   AUDIO_EVENT_IMPORT,
//   SHALLOW_AUDIO_EVENT,
//   TAG,
// } from "@baw-api/ServiceTokens";
// import { modelData } from "@test/helpers/faker";
// import { AudioEventImportService } from "@baw-api/audio-event-import/audio-event-import.service";
// import { DateTime, Settings } from "luxon";
// import { Id } from "@interfaces/apiInterfaces";
// import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
// import { InlineListComponent } from "@shared/inline-list/inline-list.component";
// import { LoadingComponent } from "@shared/loading/loading.component";
// import { fakeAsync  } from "@angular/core/testing";
// import { AssociationInjector } from "@models/ImplementsInjector";
// import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
// import { AnnotationsDetailsComponent } from "./details.component";

// describe("AnnotationsDetailsComponent", () => {
//   let spectator: SpectatorRouting<AnnotationsDetailsComponent>;

//   let injector: SpyObject<AssociationInjector>;
//   let mockTagsService: SpyObject<TagsService>;
//   let mockEventsService: SpyObject<ShallowAudioEventsService>;
//   let mockAudioEventImportService: SpyObject<AudioEventImportService>;

//   let mockAudioEventImport: AudioEventImport;
//   let mockTagModels: Tag[];
//   let mockAudioEvents: AudioEvent[];

//   const createComponent = createRoutingFactory({
//     component: AnnotationsDetailsComponent,
//     declarations: [
//       InlineListComponent,
//       TypeaheadInputComponent,
//       LoadingComponent,
//     ],
//     imports: [SharedModule, MockBawApiModule],
//     mocks: [ToastrService],
//   });

//   function setup(): void {
//     spectator = createComponent({
//       detectChanges: false,
//       data: {
//         audioEventImport: {
//           model: mockAudioEventImport,
//         },
//       },
//     });

//     injector = spectator.inject(ASSOCIATION_INJECTOR);
//     mockAudioEventImport["injector"] = injector;

//     mockTagModels = [];
//     mockAudioEvents = [];

//     mockTagsService = spectator.inject(TAG.token);
//     mockTagsService.filter.and.callFake(() => of(mockTagModels));

//     mockEventsService = spectator.inject(SHALLOW_AUDIO_EVENT.token);
//     mockEventsService.filter.and.callFake(() => of(mockAudioEvents));

//     mockAudioEventImportService = spectator.inject(AUDIO_EVENT_IMPORT.token);
//     mockAudioEventImportService.show = jasmine.createSpy("show") as any;
//     mockAudioEventImportService.show.and.callFake(() =>
//       of(mockAudioEventImport)
//     );

//     // without mocking the timezone, tests that assert time will fail in CI
//     // and other timezones that are not the same as the developers local timezone (UTC+8)
//     const mockUserTimeZone = "Australia/Perth"; // +08:00 UTC
//     Settings.defaultZone = mockUserTimeZone;

//     spectator.detectChanges();
//   }

//   function getElementByInnerText<T extends HTMLElement>(text: string): T {
//     return spectator.debugElement.query(
//       (element) => element.nativeElement.innerText === text
//     )?.nativeElement as T;
//   }

//   function addFileToImportGroup(index: number, file: File): void {
//     const requestedInputElement = getFileInputElement(index);

//     const dataTransfer = new DataTransfer();
//     dataTransfer.items.add(file);
//     requestedInputElement.files = dataTransfer.files;

//     requestedInputElement.dispatchEvent(new Event("change"));
//     spectator.detectChanges();
//   }

//   function generateMockFile(): File {
//     return new File(
//       [modelData.descriptionLong()],
//       modelData.system.commonFileName("csv")
//     );
//   }

//   beforeEach(() => {
//     mockAudioEventImport = new AudioEventImport(generateAudioEventImport());
//     setup();
//   });

//   assertPageInfo<AudioEventImport>(AnnotationsDetailsComponent, "test name", {
//     audioEventImport: {
//       model: new AudioEventImport(
//         generateAudioEventImport({ name: "test name" })
//       ),
//     },
//   });

//   it("should create", () => {
//     expect(spectator.component).toBeInstanceOf(AnnotationsDetailsComponent);
//   });

//   it("should make one correct audio event request", () => {
//     const expectedFilters = {
//       // eslint-disable-next-line @typescript-eslint/naming-convention
//       filter: { audio_event_import_id: { eq: mockAudioEventImport.id } },
//       sorting: { direction: "desc", orderBy: "createdAt" },
//       paging: { page: 1 },
//     };

//     expect(mockEventsService.filter).toHaveBeenCalledOnceWith(expectedFilters);
//   });

//   it("should make one correct file request when changing to the files tab", () => {});

//   it("should use a local dateTime format for events table rows", () => {
//     const importedAt = DateTime.fromISO("2022-11-04T20:12:31.000Z");
//     // relative to UTC+8
//     const expectedDateTime = "2022-11-05 04:12:31";

//     // we use the interface here because we are using it as a sub-model on the AudioEventImport constructor
//     // this means that the mockImportedFile will be called with the AudioEventImportFileRead constructor
//     const mockImportedFile: IAudioEventImportFileRead = {
//       name: modelData.system.commonFileName("csv"),
//       importedAt,
//       additionalTags: [],
//     };

//     mockAudioEventImport = new AudioEventImport(
//       generateAudioEventImport({
//         files: [mockImportedFile],
//       })
//     );

//     mockAudioEventImport["injector"] = injector;

//     mockAudioEventImport.files.map(
//       (fileModel: AudioEventImportFileRead) =>
//         (fileModel["injector"] = injector)
//     );

//     spectator.component.audioEventImport = mockAudioEventImport;

//     spectator.detectChanges();

//     const importedAtColumn =
//       getElementByInnerText<HTMLTableCellElement>(expectedDateTime);

//     expect(importedAtColumn).toExist();
//   });

//   it("should use a local dateTime format for the file table rows", () => {
//     const importedAt = DateTime.fromISO("2022-11-04T20:12:31.000Z");
//     // relative to UTC+8
//     const expectedDateTime = "2022-11-05 04:12:31";

//     // we use the interface here because we are using it as a sub-model on the AudioEventImport constructor
//     // this means that the mockImportedFile will be called with the AudioEventImportFileRead constructor
//     const mockImportedFile: IAudioEventImportFileRead = {
//       name: modelData.system.commonFileName("csv"),
//       importedAt,
//       additionalTags: [],
//     };

//     mockAudioEventImport = new AudioEventImport(
//       generateAudioEventImport({
//         files: [mockImportedFile],
//       })
//     );

//     mockAudioEventImport["injector"] = injector;

//     mockAudioEventImport.files.map(
//       (fileModel: AudioEventImportFileRead) =>
//         (fileModel["injector"] = injector)
//     );

//     spectator.component.audioEventImport = mockAudioEventImport;

//     spectator.detectChanges();

//     const importedAtColumn =
//       getElementByInnerText<HTMLTableCellElement>(expectedDateTime);

//     expect(importedAtColumn).toExist();
//   });

//   it("should make the correct dry run calls for multiple event groups", fakeAsync(() => {
//     const mockFiles: File[] = modelData.randomArray(4, 10, () =>
//       generateMockFile()
//     );

//     mockFiles.forEach((file: File, i: number) => {
//       addFileToImportGroup(i, file);

//       expect(mockAudioEventImportService.importFile).toHaveBeenCalledWith(
//         jasmine.objectContaining({ file })
//       );
//     });

//     expect(mockAudioEventImportService.importFile).toHaveBeenCalledTimes(
//       mockFiles.length
//     );
//   }));

//   it("should not display a remove button for an import group with no files", () => {
//     // we want to add a new import group and assert that the empty import group does not include a remove button
//     addFileToImportGroup(0, generateMockFile());
//     const removeButtons: HTMLButtonElement[] =
//       spectator.queryAll<HTMLButtonElement>(".remove-import-group-button");
//     expect(removeButtons).toHaveLength(1);
//   });

//   it("should disable the 'import All' button when there is an error in an import group", () => {
//     const fakeErrors: string[] = ["audio_recording_id must be greater than 0"];

//     addFileToImportGroup(0, generateMockFile());

//     spectator.component.importGroups[0].errors = fakeErrors;
//     spectator.detectChanges();

//     expect(importAllButton()).toBeDisabled();
//   });
// });
