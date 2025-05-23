import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { AudioEventImport } from "@models/AudioEventImport";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { ToastService } from "@services/toasts/toasts.service";
import { assertDatatable, assertDatatableRow } from "@test/helpers/datatable";
import { AudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import {
  AUDIO_EVENT_IMPORT_FILE,
  AUDIO_RECORDING,
  TAG,
} from "@baw-api/ServiceTokens";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { modelData } from "@test/helpers/faker";
import { generateAudioEventImportFile } from "@test/fakes/AudioEventImportFile";
import {
  clickButton,
  inputFile,
  selectFromTypeahead,
} from "@test/helpers/html";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { TagsService } from "@baw-api/tag/tags.service";
import { Tag } from "@models/Tag";
import { generateTag } from "@test/fakes/Tag";
import { Observable, of, throwError } from "rxjs";
import { Router } from "@angular/router";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { UNPROCESSABLE_ENTITY } from "http-status";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { fakeAsync } from "@angular/core/testing";
import { IconsModule } from "@shared/icons/icons.module";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { AddAnnotationsComponent } from "./add-annotations.component";

describe("AddAnnotationsComponent", () => {
  let spec: Spectator<AddAnnotationsComponent>;

  let injectorSpy: SpyObject<AssociationInjector>;
  let fileImportSpy: SpyObject<AudioEventImportFileService>;
  let tagServiceSpy: SpyObject<TagsService>;
  let recordingServiceSpy: SpyObject<AudioRecordingsService>;

  let notificationsSpy: SpyObject<ToastService>;
  let routerSpy: SpyObject<Router>;

  let audioEventImport: AudioEventImport;
  let routeProject: Project;
  let mockImportResponse: AudioEventImportFile | BawApiError;
  let mockTagsResponse: Tag[];
  let mockRecordingsResponse: AudioRecording;

  const createComponent = createRoutingFactory({
    component: AddAnnotationsComponent,
    imports: [
      IconsModule,

      InlineListComponent,
      TypeaheadInputComponent,
      LoadingComponent,
    ],
    providers: [provideMockBawApi()],
    mocks: [ToastService],
    data: {
      resolvers: {
        model: audioEventImport,
      },
    },
  });

  const fileInput = () => spec.query<HTMLInputElement>("input[type=file]");
  const eventsTable = () => spec.query<HTMLTableElement>("ngx-datatable");
  const eventTableRows = () =>
    eventsTable().querySelectorAll<HTMLDivElement>("datatable-body-row");
  const importFilesButton = () => spec.query<HTMLButtonElement>("#import-btn");

  const fileListItems = () => spec.queryAll<HTMLLIElement>(".file-list-item");
  const fileAlerts = () => spec.queryAll<HTMLElement>(".file-error");
  const removeFileButtons = () =>
    spec.queryAll<HTMLButtonElement>(".remove-file-btn");
  const additionalFileTagInputs = () => spec.queryAll(".additional-file-tags");
  const extraTagsTypeahead = (): TypeaheadInputComponent & HTMLElement =>
    spec.query("#extra-tags-input");

  function addFiles(files: File[]): void {
    inputFile(spec, fileInput(), files);
  }

  function addExtraTag(tag: string): void {
    const target = extraTagsTypeahead();
    selectFromTypeahead(spec, target, tag);
  }

  function commitImport(): void {
    clickButton(spec, importFilesButton());
  }

  function removeFile(index: number): void {
    clickButton(spec, removeFileButtons()[index]);
  }

  function addTagToFile(index: number, tag: string): void {
    const target = additionalFileTagInputs()[index];
    selectFromTypeahead(spec, target, tag);
  }

  function filesAdditionalTags(index: number): string[] {
    const tagInput = additionalFileTagInputs()[index];
    const itemPills = tagInput.querySelectorAll(".item-pill");
    return Array.from(itemPills).map((item) => item.textContent.trim());
  }

  function setup(): void {
    spec = createComponent({ detectChanges: false });
    injectorSpy = spec.inject(ASSOCIATION_INJECTOR);

    audioEventImport["injector"] = injectorSpy;
    spec.component.audioEventImport = audioEventImport;

    routeProject["injector"] = injectorSpy;
    spec.component.project = routeProject;

    fileImportSpy = spec.inject(AUDIO_EVENT_IMPORT_FILE.token);
    tagServiceSpy = spec.inject(TAG.token);
    recordingServiceSpy = spec.inject(AUDIO_RECORDING.token);

    notificationsSpy = spec.inject(ToastService);
    routerSpy = spec.inject(Router);

    notificationsSpy.success.and.stub();
    notificationsSpy.error.and.stub();

    mockImportResponse = new AudioEventImportFile(
      generateAudioEventImportFile({
        audioEventImportId: audioEventImport.id,
      }),
      injectorSpy,
    );

    mockTagsResponse = modelData.randomArray(
      1,
      10,
      () => new Tag(generateTag(), injectorSpy),
    );

    mockRecordingsResponse = new AudioRecording(
      generateAudioRecording(),
      injectorSpy,
    );

    fileImportSpy.create.and.callFake(() => of(mockImportResponse));
    fileImportSpy.dryCreate.and.callFake(() => of(mockImportResponse));

    tagServiceSpy.filter.and.callFake(() => of(mockTagsResponse));
    tagServiceSpy.typeaheadCallback.and.returnValue(() => of(mockTagsResponse));

    recordingServiceSpy.show.and.callFake(() => of(mockRecordingsResponse));

    spec.detectChanges();
  }

  beforeEach(() => {
    audioEventImport = new AudioEventImport(generateAudioEventImport());
    routeProject = new Project(generateProject());

    setup();
  });

  assertPageInfo<AudioEventImport>(
    AddAnnotationsComponent,
    "Add New Annotations",
  );

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(AddAnnotationsComponent);
  });

  it("should disable the import button if no files are uploaded", () => {
    expect(importFilesButton()).toBeDisabled();
  });

  describe("file type correction", () => {
    it("should not convert the type of a correct csv file", () => {
      const testFile = modelData.file({ name: "test.csv", type: "text/csv" });

      addFiles([testFile]);

      expect(fileImportSpy.dryCreate).toHaveBeenCalledWith(
        jasmine.objectContaining({
          file: jasmine.objectContaining({ type: "text/csv" }),
        }),
        audioEventImport,
      );
    });

    it("should correctly convert the type for a incorrectly typed csv", () => {
      // There is a "feature" in Windows where the uploading a csv file through
      // the HTML file input will emit the type as "application/vnd.ms-excel"
      // this can cause server side issues where the server tries to parse the
      // file as an excel file instead of a csv file.
      // To fix this, we convert the file type of files with the .csv extension
      // and the type "application/vnd.ms-excel" to "text/csv".

      const testFile = modelData.file({
        name: "test.csv",
        type: "application/vnd.ms-excel",
      });

      addFiles([testFile]);

      expect(fileImportSpy.dryCreate).toHaveBeenCalledWith(
        jasmine.objectContaining({
          file: jasmine.objectContaining({ type: "text/csv" }),
        }),
        audioEventImport,
      );
    });

    it("should not change the type of an excel file", () => {
      const testFile = modelData.file({
        name: "test.xlsx",
        type: "application/vnd.ms-excel",
      });

      addFiles([testFile]);

      expect(fileImportSpy.dryCreate).toHaveBeenCalledWith(
        jasmine.objectContaining({
          file: jasmine.objectContaining({ type: "application/vnd.ms-excel" }),
        }),
        audioEventImport,
      );
    });
  });

  describe("removing files", () => {
    it("should remove files from the file input if the remove button is clicked", () => {
      addFiles([modelData.file(), modelData.file()]);

      removeFile(0);

      const expectedFileCount = 1;
      expect(fileInput().files).toHaveLength(expectedFileCount);
      expect(fileListItems()).toHaveLength(expectedFileCount);
    });

    it("should perform a dry run when a file is removed", () => {
      const testedFiles = [modelData.file(), modelData.file()];
      addFiles(testedFiles);

      fileImportSpy.dryCreate.calls.reset();
      removeFile(0);

      expect(fileImportSpy.dryCreate).toHaveBeenCalledTimes(1);
    });

    it("should not perform a dry run if all files are removed", () => {
      addFiles([modelData.file()]);

      fileImportSpy.dryCreate.calls.reset();
      removeFile(0);

      expect(fileImportSpy.dryCreate).not.toHaveBeenCalled();

      // we do expect that all of the identified events and files have been
      // removed from the page
      expect(eventTableRows()).toHaveLength(0);
      expect(fileListItems()).toHaveLength(0);
      expect(fileInput().files).toHaveLength(0);
    });
  });

  // the navigation warning depends on the UnsavedInputGuard
  // therefore, we can test that the "hasUnsavedChanges" getter returns the
  // correct value.
  // the assertions to check that this guard works correctly can be found in
  // the UnsavedInputGuard spec file
  describe("navigation warning", () => {
    it("should warn if the navigates without committing an uploaded file", () => {
      addFiles([modelData.file()]);

      expect(spec.component.hasUnsavedChanges).toBeTrue();
    });

    it("should not warn if the user has not staged files", () => {
      expect(spec.component.hasUnsavedChanges).toBeFalse();
    });

    it("should not warn if the user has committed their files", () => {
      addFiles([modelData.file()]);
      commitImport();

      expect(spec.component.hasUnsavedChanges).toBeFalse();
    });

    it("should warn if the user fails to commit their files", () => {
      addFiles([modelData.file()]);

      // in we simulate the dry run succeeding, but the commit failing
      // therefore, I override the create method to return an error
      // after I have added files and the dry run has succeeded
      fileImportSpy.create.and.callThrough();
      fileImportSpy.create.andCallFake(() =>
        throwError(
          () =>
            new BawApiError(
              UNPROCESSABLE_ENTITY,
              "Internal Server Error",
              null,
            ),
        ),
      );

      commitImport();

      expect(spec.component.hasUnsavedChanges).toBeTrue();
    });
  });

  describe("dry run", () => {
    it("should dry run a single file correctly", () => {
      const file = modelData.file();
      addFiles([file]);

      expect(fileImportSpy.dryCreate).toHaveBeenCalledWith(
        jasmine.any(AudioEventImportFile),
        audioEventImport,
      );
    });

    it("should dry run multiple files correctly", () => {
      const testedFiles = [modelData.file(), modelData.file()];
      addFiles(testedFiles);

      // each file should be individually dry run through the api
      expect(fileImportSpy.dryCreate).toHaveBeenCalledTimes(2);

      testedFiles.forEach((file) => {
        expect(fileImportSpy.dryCreate).toHaveBeenCalledWith(
          jasmine.objectContaining({ file }),
          audioEventImport,
        );
      });
    });

    it("should update the identified event table when a dry run completes", () => {
      addFiles([modelData.file()]);

      const mockResponse = mockImportResponse as AudioEventImportFile;
      const tableRows = eventTableRows();

      const expectedRowCount = Math.min(
        mockResponse.importedEvents.length,
        defaultApiPageSize,
      );
      expect(tableRows).toHaveLength(expectedRowCount);

      mockResponse.importedEvents.forEach((event, i) => {
        const row = tableRows[i];

        const expectedTagValue =
          event.tags.length > 0
            ? event.tags.map((tag) => tag.text).join(", ")
            : "Empty";

        const expectedErrorValue =
          event.errors.length > 0 ? event.errors.join("") : "No errors";

        const expectedRowValues = [
          `1:${i + 1}`,
          // event.audioRecordingId.toLocaleString(),
          "Loading...",
          event.startTimeSeconds.toLocaleString(),
          event.endTimeSeconds.toLocaleString(),
          event.lowFrequencyHertz.toLocaleString(),
          event.highFrequencyHertz.toLocaleString(),
          event.channel.toLocaleString(),
          event.isReference ? "Yes" : "No",
          event.score.toLocaleString(),
          expectedTagValue,
          expectedErrorValue,
        ];

        assertDatatableRow(row, expectedRowValues);
      });
    });

    it("should enable the import button when a dry run completes", () => {
      // because the default mock of the dry run api return an observable for a
      // valid dry run, we expect that the import button will be enabled
      // directly after adding files
      addFiles([modelData.file()]);
      expect(importFilesButton()).not.toBeDisabled();
    });

    it("should disable the import button when performing a dry run", () => {
      // we create an observable that never completes to simulate a dry run
      // that is still waiting for an api response
      fileImportSpy.dryCreate.and.callFake(() => new Observable());

      addFiles([modelData.file()]);

      expect(importFilesButton()).toBeDisabled();
    });

    it("should disable the import button if there are errors in the dry run", () => {
      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        mockImportResponse as any,
        { file: "validation failed" },
      );

      fileImportSpy.dryCreate.and.callThrough();
      fileImportSpy.dryCreate.andCallFake(() =>
        throwError(() => mockImportResponse),
      );

      addFiles([modelData.file()]);

      expect(importFilesButton()).toBeDisabled();
    });
  });

  describe("additional tags", () => {
    describe("file additional tags", () => {
      it("should perform a dry run when additional tags are added to a file", fakeAsync(() => {
        addFiles([modelData.file()]);

        fileImportSpy.dryCreate.calls.reset();

        const testedTag = mockTagsResponse[0];
        addTagToFile(0, testedTag.text);

        expect(fileImportSpy.dryCreate).toHaveBeenCalledOnceWith(
          jasmine.objectContaining({
            additionalTagIds: [testedTag.id],
          }),
          audioEventImport,
        );
      }));

      it("should commit a files additional tags when the import is committed", fakeAsync(() => {
        addFiles([modelData.file()]);

        const testedTag = mockTagsResponse[0];
        addTagToFile(0, testedTag.text);

        commitImport();

        expect(fileImportSpy.create).toHaveBeenCalledWith(
          jasmine.objectContaining({
            additionalTagIds: [testedTag.id],
          }),
          audioEventImport,
        );
      }));

      it("should start with no additional tags", () => {
        addFiles([modelData.file(), modelData.file()]);
        expect(filesAdditionalTags(0)).toHaveLength(0);
      });
    });

    describe("extra tags", () => {
      it("should add extra tags to every queued file", fakeAsync(() => {
        addFiles([modelData.file(), modelData.file()]);

        const testedTag = mockTagsResponse[0];
        addExtraTag(testedTag.text);

        expect(filesAdditionalTags(0)).toContain(testedTag.text);
      }));

      it("should clear the extra tags input once a tag is selected", fakeAsync(() => {
        addFiles([modelData.file(), modelData.file()]);

        const testedTag = mockTagsResponse[0];
        addExtraTag(testedTag.text);

        expect(extraTagsTypeahead().value).toHaveLength(0);
      }));
    });
  });

  describe("committing an annotation import", () => {
    it("should commit a single file correctly", () => {
      addFiles([modelData.file()]);

      // we want to test that the commit api has not been called until we click
      // the import button
      expect(fileImportSpy.create).not.toHaveBeenCalled();

      // commitImport();

      // expect(fileImportSpy.create).toHaveBeenCalledWith(
      //   jasmine.any(AudioEventImportFile),
      //   audioEventImport
      // );
    });

    it("should commit multiple files correctly", () => {
      const testedFiles = [modelData.file(), modelData.file()];
      addFiles(testedFiles);

      expect(fileImportSpy.create).not.toHaveBeenCalled();

      commitImport();

      // each file should be individually committed through the api
      expect(fileImportSpy.create).toHaveBeenCalledTimes(2);

      testedFiles.forEach((file) => {
        expect(fileImportSpy.create).toHaveBeenCalledWith(
          jasmine.objectContaining({ file }),
          audioEventImport,
        );
      });
    });

    it("should navigate to the import details page when an import completes", () => {
      const expectedRoute = `/projects/${routeProject.id}/import_annotations/${audioEventImport.id}`;

      addFiles([modelData.file()]);
      commitImport();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
    });

    it("should display a toast notification when an import completes", () => {
      addFiles([modelData.file()]);
      commitImport();
      expect(notificationsSpy.success).toHaveBeenCalledOnceWith(
        "Successfully imported annotations",
      );
    });
  });

  describe("error handling", () => {
    // Because the api returns 422 responses if the dry run fails, we would
    // normally expect an error notification to be raised.
    // However, because we support more descriptive error messages in the
    // identified events table, we do not want to raise an error notification
    // if a dry run fails, and instead show the errors in the table.
    it("should not raise error notifications if a dry run fails", () => {
      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        mockImportResponse as any,
        { file: "validation failed" },
      );

      fileImportSpy.dryCreate.and.callThrough();
      fileImportSpy.dryCreate.andCallFake(() =>
        throwError(() => mockImportResponse),
      );

      // by adding files, we expect that the website will perform a dry run
      // and therefore, we expect that the api will return an error
      // however, we expect that he error will not be shown as a notification
      addFiles([modelData.file()]);

      expect(notificationsSpy.error).not.toHaveBeenCalledTimes(1);
      expect(notificationsSpy.error).not.toHaveBeenCalled();
    });

    // We have error alerts for files because sometimes the server will fail
    // a dry run for reasons other than contents of the file.
    // e.g. an unsupported file type
    // In these cases, we want to show the error next to the file in the form
    // of an error alert.
    it("should show a single error alert if single file import fails", () => {
      const mockErrorMessage =
        "is not unique. Duplicate recording found with id: 191";
      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        mockImportResponse as any,
        { file: mockErrorMessage },
      );

      fileImportSpy.dryCreate.and.callThrough();
      fileImportSpy.dryCreate.andCallFake(() =>
        throwError(() => mockImportResponse),
      );

      const mockUploadedFile = modelData.file();
      addFiles([mockUploadedFile]);

      expect(fileAlerts()).toHaveLength(1);

      expect(fileAlerts()[0]).toHaveExactTrimmedText(mockErrorMessage);
    });

    it("should show multiple error alerts if multiple file import fails", () => {
      const mockErrorMessage = "validation failed";
      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        mockImportResponse as any,
        { file: mockErrorMessage },
      );

      fileImportSpy.dryCreate.and.callThrough();
      fileImportSpy.dryCreate.andCallFake(() =>
        throwError(() => mockImportResponse),
      );

      const mockAudioFiles = [modelData.file(), modelData.file()];
      addFiles(mockAudioFiles);

      expect(fileAlerts()).toHaveLength(2);

      // even though the files could have different error messages, we expect
      // that the error message for both files will be the same because
      // we have mocked the response above to always return the same error
      // ideally, this test would assert against different errors for each file
      // but that would make this test much more complex (requiring a lot of
      // time, for not much benefit).
      // TODO: given time, make this test test against different errors
      for (const fileAlert of fileAlerts()) {
        expect(fileAlert).toHaveExactTrimmedText(mockErrorMessage);
      }
    });
  });

  describe("identified events table", () => {
    assertDatatable(() => ({
      root: () => eventsTable(),
      columns: () => [
        "ID",
        "Recording",
        "Start Time",
        "End Time",
        "Low Frequency",
        "High Frequency",
        "Channel",
        "Reference",
        "Score",
        "Tags",
        "Errors",
      ],
      rows: () => [],
    }));
  });
});
