import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { AudioEventImport } from "@models/AudioEventImport";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ToastrService } from "ngx-toastr";
import { assertDatatableRow } from "@test/helpers/datatable";
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
import { AddAnnotationsComponent } from "./add-annotations.component";

describe("AddAnnotationsComponent", () => {
  let spectator: Spectator<AddAnnotationsComponent>;

  let injectorSpy: SpyObject<AssociationInjector>;
  let fileImportSpy: SpyObject<AudioEventImportFileService>;
  let tagServiceSpy: SpyObject<TagsService>;
  let recordingServiceSpy: SpyObject<AudioRecordingsService>;

  let notificationsSpy: SpyObject<ToastrService>;
  let routerSpy: SpyObject<Router>;

  let audioEventImport: AudioEventImport;
  let mockImportResponse: AudioEventImportFile | BawApiError;
  let mockTagsResponse: Tag[];
  let mockRecordingsResponse: AudioRecording;

  const createComponent = createRoutingFactory({
    component: AddAnnotationsComponent,
    declarations: [
      InlineListComponent,
      TypeaheadInputComponent,
      LoadingComponent,
    ],
    imports: [SharedModule, MockBawApiModule],
    mocks: [ToastrService],
    data: {
      resolvers: {
        model: audioEventImport,
      },
    },
  });

  const fileInput = () => spectator.query<HTMLInputElement>("input[type=file]");
  const eventsTable = () => spectator.query<HTMLTableElement>("ngx-datatable");
  const eventTableRows = () =>
    eventsTable().querySelectorAll<HTMLDivElement>("datatable-body-row");
  const importFilesButton = () =>
    spectator.query<HTMLButtonElement>("#import-btn");
  const extraTagsInput = () =>
    spectator.query<HTMLElement>("#extra-tags-input");

  const fileAlerts = () => spectator.queryAll(".file-error");

  function addFiles(files: File[]): void {
    inputFile(spectator, fileInput(), files);
  }

  function addExtraTag(tag: string): void {
    const target = extraTagsInput();
    selectFromTypeahead(spectator, target, tag);
  }

  function commitImport(): void {
    clickButton(spectator, importFilesButton());
  }

  function setup(): void {
    spectator = createComponent({ detectChanges: false });
    injectorSpy = spectator.inject(ASSOCIATION_INJECTOR);

    spectator.component.audioEventImport = audioEventImport;
    audioEventImport["injector"] = injectorSpy;

    fileImportSpy = spectator.inject(AUDIO_EVENT_IMPORT_FILE.token);
    tagServiceSpy = spectator.inject(TAG.token);
    recordingServiceSpy = spectator.inject(AUDIO_RECORDING.token);

    notificationsSpy = spectator.inject(ToastrService);
    routerSpy = spectator.inject(Router);

    notificationsSpy.success.and.stub();
    notificationsSpy.error.and.stub();

    mockImportResponse = new AudioEventImportFile(
      generateAudioEventImportFile({
        audioEventImportId: audioEventImport.id,
      }),
      injectorSpy
    );

    mockTagsResponse = modelData.randomArray(
      1,
      10,
      () => new Tag(generateTag(), injectorSpy)
    );

    mockRecordingsResponse = new AudioRecording(
      generateAudioRecording(),
      injectorSpy
    );

    fileImportSpy.create.and.callFake(() => of(mockImportResponse));
    fileImportSpy.dryCreate.and.callFake(() => of(mockImportResponse));

    tagServiceSpy.filter.and.callFake(() => of(mockTagsResponse));

    recordingServiceSpy.show.and.callFake(() => of(mockRecordingsResponse));

    spectator.detectChanges();
  }

  beforeEach(() => {
    audioEventImport = new AudioEventImport(generateAudioEventImport());
    setup();
  });

  assertPageInfo<AudioEventImport>(
    AddAnnotationsComponent,
    "Add New Annotations"
  );

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AddAnnotationsComponent);
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
        audioEventImport
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
        audioEventImport
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
        audioEventImport
      );
    });
  });

  describe("file input", () => {
    it("should remove files from the file input if the remove button is clicked", () => {});
  });

  // the navigation warning depends on the UnsavedInputGuard
  // therefore, we can test that the "hasUnsavedChanges" getter returns the
  // correct value.
  // the assertions to check that this guard works correctly can be found in
  // the UnsavedInputGuard spec file
  describe("navigation warning", () => {
    it("should warn if the navigates without committing an uploaded file", () => {
      addFiles([modelData.file()]);

      expect(spectator.component.hasUnsavedChanges).toBeTrue();
    });

    it("should not warn if the user did not upload any files", () => {
      expect(spectator.component.hasUnsavedChanges).toBeFalse();
    });

    it("should not warn if the user has committed their files", () => {});

    it("should warn if the user fails to commit their files", () => {});
  });

  describe("dry run", () => {
    it("should dry run a single file correctly", () => {
      const file = modelData.file();
      addFiles([file]);

      expect(fileImportSpy.dryCreate).toHaveBeenCalledWith(
        jasmine.any(AudioEventImportFile),
        audioEventImport
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
          audioEventImport
        );
      });
    });

    it("should update the identified event table when a dry run completes", () => {
      addFiles([modelData.file()]);

      const mockResponse = mockImportResponse as AudioEventImportFile;
      const tableRows = eventTableRows();

      const expectedRowCount = Math.min(
        mockResponse.importedEvents.length,
        defaultApiPageSize
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
          event.durationSeconds.toLocaleString(),
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
        { file: "validation failed" }
      );

      fileImportSpy.dryCreate.and.callThrough();
      fileImportSpy.dryCreate.andCallFake(() =>
        throwError(() => mockImportResponse)
      );

      addFiles([modelData.file()]);

      expect(importFilesButton()).toBeDisabled();
    });
  });

  describe("additional tags", () => {
    describe("file additional tags", () => {
      it("should perform a dry run when additional tags are added to a file", () => {});

      it("should commit a files additional tags when the import is committed", () => {});

      it("should start with no additional tags", () => {});
    });

    describe("extra tags", () => {
      it("should add extra tags to every queued file", fakeAsync(() => {
        addExtraTag("test tag");
      }));

      it("should clear the extra tags input once a tag is selected", () => {});

      it("should disable the extra tags input if there are no files added", () => {});

      it("should re-disable the extra tags input if all files are removed", () => {});
    });
  });

  describe("committing an annotation import", () => {
    it("should commit a single file correctly", () => {
      addFiles([modelData.file()]);

      // we want to test that the commit api has not been called until we click
      // the import button
      expect(fileImportSpy.create).not.toHaveBeenCalled();

      commitImport();

      expect(fileImportSpy.create).toHaveBeenCalledWith(
        jasmine.any(AudioEventImportFile),
        audioEventImport
      );
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
          audioEventImport
        );
      });
    });

    it("should navigate to the import details page when an import completes", () => {
      addFiles([modelData.file()]);
      commitImport();
      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(
        `/batch_annotations/${audioEventImport.id}`
      );
    });

    it("should display a toast notification when an import completes", () => {
      addFiles([modelData.file()]);
      commitImport();
      expect(notificationsSpy.success).toHaveBeenCalledOnceWith(
        "Successfully imported annotations"
      );
    });
  });

  describe("error handling", () => {
    // Because the api returns 422 responses if the dry run fails, we would
    // normally expect an error notification to be raised.
    // However, because we support more descriptive error messages in the
    // identified events table, we do not want to raise an error notification
    // if a dry run fails, and instead show the errors in the table.
    it("should not raise error notifications if a dry run fails", () => {});

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
        { file: mockErrorMessage }
      );

      fileImportSpy.dryCreate.and.callThrough();
      fileImportSpy.dryCreate.andCallFake(() =>
        throwError(() => mockImportResponse)
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
        { file: mockErrorMessage }
      );

      fileImportSpy.dryCreate.and.callThrough();
      fileImportSpy.dryCreate.andCallFake(() =>
        throwError(() => mockImportResponse)
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
      for (const fileAlert in fileAlerts()) {
        expect(fileAlert).toHaveExactTrimmedText(mockErrorMessage);
      }
    });

    it("should not show a success alert if a dry run succeeds", () => {
      // by adding files to the file input, we are performing a dry run
      addFiles([modelData.file()]);
      expect(fileAlerts()).not.toExist();
    });
  });

  // xdescribe("identified events table", () => {
  //   assertDatatable(() => ({
  //     root: () => eventsTable(),
  //     service: fileImportSpy,
  //     columns: [
  //       "Recording",
  //       "Start Time",
  //       "End Time",
  //       "Low Frequency",
  //       "High Frequency",
  //       "Channel",
  //       "Duration",
  //       "Reference",
  //       "Score",
  //       "Tags",
  //       "Errors",
  //     ],
  //     rows: [],
  //   }));
  // });
});
