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
  AUDIO_EVENT_PROVENANCE,
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
import { Observable, of, Subject, throwError } from "rxjs";
import { Router } from "@angular/router";
import { BawApiError } from "@helpers/custom-errors/baw-api-error";
import { UNPROCESSABLE_ENTITY } from "http-status";
import { defaultApiPageSize } from "@baw-api/baw-api.service";
import { AssociationInjector } from "@models/ImplementsInjector";
import { ASSOCIATION_INJECTOR } from "@services/association-injector/association-injector.tokens";
import { AudioRecordingsService } from "@baw-api/audio-recording/audio-recordings.service";
import { AudioRecording } from "@models/AudioRecording";
import { generateAudioRecording } from "@test/fakes/AudioRecording";
import { fakeAsync, flush } from "@angular/core/testing";
import { IconsModule } from "@shared/icons/icons.module";
import { provideMockBawApi } from "@baw-api/provide-baw-ApiMock";
import { Project } from "@models/Project";
import { generateProject } from "@test/fakes/Project";
import { AudioEventProvenanceService } from "@baw-api/audio-event-provenance/audio-event-provenance.service";
import { AudioEventProvenance } from "@models/AudioEventProvenance";
import { generateAudioEventProvenance } from "@test/fakes/AudioEventProvenance";
import { IImportedAudioEvent } from "@models/AudioEventImport/ImportedAudioEvent";
import { generateImportedAudioEvent } from "@test/fakes/ImportedAudioEvent";
import { AddAnnotationsComponent } from "./add-annotations.component";

describe("AddAnnotationsComponent", () => {
  let spec: Spectator<AddAnnotationsComponent>;

  let injectorSpy: SpyObject<AssociationInjector>;
  let fileImportSpy: SpyObject<AudioEventImportFileService>;
  let tagServiceSpy: SpyObject<TagsService>;
  let recordingServiceSpy: SpyObject<AudioRecordingsService>;
  let provenanceServiceSpy: SpyObject<AudioEventProvenanceService>;

  let notificationsSpy: SpyObject<ToastService>;
  let routerSpy: SpyObject<Router>;

  let audioEventImport: AudioEventImport;
  let routeProject: Project;
  let mockImportResponse: AudioEventImportFile | BawApiError<AudioEventImportFile>;
  let mockTagsResponse: Tag[];
  let mockProvenanceResponse: AudioEventProvenance[];
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

  const additionalFileTagInputs = (): (TypeaheadInputComponent &
    HTMLElement)[] => spec.queryAll(".additional-file-tags");
  const extraTagsTypeahead = (): TypeaheadInputComponent & HTMLElement =>
    spec.query("#extra-tags-input");

  const provenanceFileInputs = () => spec.queryAll(".file-provenance");
  const extraProvenanceTypeahead = (): TypeaheadInputComponent & HTMLElement =>
    spec.query("#extra-provenance-input");

  function addFiles(files: File[]): void {
    inputFile(spec, fileInput(), files);

    // We have to flush the async queue so that the associations inside of the
    // preview table finish resolving.
    flush();
    spec.detectChanges();
  }

  function removeFile(index: number): void {
    clickButton(spec, removeFileButtons()[index]);

    // We have to flush the async queue so that the associations inside of the
    // preview table finish resolving.
    flush();
    spec.detectChanges();
  }

  function addExtraTag(tag: string): void {
    const target = extraTagsTypeahead();
    selectFromTypeahead(spec, target, tag);
  }

  function addExtraProvenance(tag: string): void {
    const target = extraProvenanceTypeahead();
    selectFromTypeahead(spec, target, tag);
  }

  function commitImport(): void {
    clickButton(spec, importFilesButton());
  }

  function addTagToFile(index: number, tag: string): void {
    const target = additionalFileTagInputs()[index];
    selectFromTypeahead(spec, target, tag);
  }

  function addProvenanceToFile(index: number, tag: string): void {
    const target = provenanceFileInputs()[index];
    selectFromTypeahead(spec, target, tag);
  }

  function fileAdditionalTags(index: number): string[] {
    const tagInput = additionalFileTagInputs()[index];
    const itemPills = tagInput.querySelectorAll(".item-pill");
    return Array.from(itemPills).map((item) => item.textContent.trim());
  }

  function fileProvenance(index: number): string {
    const provenanceInput = provenanceFileInputs()[index];
    const inputElement = provenanceInput.querySelector("input");
    return inputElement.value;
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
    provenanceServiceSpy = spec.inject(AUDIO_EVENT_PROVENANCE.token);
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

    mockProvenanceResponse = modelData.randomArray(
      1,
      10,
      () =>
        new AudioEventProvenance(generateAudioEventProvenance(), injectorSpy),
    );

    mockRecordingsResponse = new AudioRecording(
      generateAudioRecording(),
      injectorSpy,
    );

    fileImportSpy.create.and.callFake(() => of(mockImportResponse));
    fileImportSpy.dryCreate.and.callFake(() => {
      if (mockImportResponse instanceof BawApiError) {
        return throwError(() => mockImportResponse);
      }

      return of(mockImportResponse);
    });

    tagServiceSpy.filter.and.callFake(() => of(mockTagsResponse));
    tagServiceSpy.typeaheadCallback.and.returnValue(() => of(mockTagsResponse));

    provenanceServiceSpy.filter.and.callFake(() => of(mockProvenanceResponse));
    provenanceServiceSpy.show.and.callFake(() => of(mockProvenanceResponse[0]));
    provenanceServiceSpy.typeaheadCallback.and.returnValue(() =>
      of(mockProvenanceResponse),
    );

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

  it("should create", fakeAsync(() => {
    expect(spec.component).toBeInstanceOf(AddAnnotationsComponent);
  }));

  it("should disable the import button if no files are uploaded", fakeAsync(() => {
    expect(importFilesButton()).toBeDisabled();
  }));

  describe("file type correction", () => {
    it("should not convert the type of a correct csv file", fakeAsync(() => {
      const testFile = modelData.file({ name: "test.csv", type: "text/csv" });

      addFiles([testFile]);

      expect(fileImportSpy.dryCreate).toHaveBeenCalledWith(
        jasmine.objectContaining({
          file: jasmine.objectContaining({ type: "text/csv" }),
        }),
        audioEventImport,
        null,
      );
    }));

    it("should correctly convert the type for a incorrectly typed csv", fakeAsync(() => {
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
        null,
      );
    }));

    it("should not change the type of an excel file", fakeAsync(() => {
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
        null,
      );
    }));
  });

  describe("removing files", () => {
    it("should remove files from the file input if the remove button is clicked", fakeAsync(() => {
      addFiles([modelData.file(), modelData.file()]);

      removeFile(0);

      const expectedFileCount = 1;
      expect(fileInput().files).toHaveLength(expectedFileCount);
      expect(fileListItems()).toHaveLength(expectedFileCount);
    }));

    it("should perform a dry run when a file is removed", fakeAsync(() => {
      const testedFiles = [modelData.file(), modelData.file()];
      addFiles(testedFiles);

      fileImportSpy.dryCreate.calls.reset();
      removeFile(0);

      expect(fileImportSpy.dryCreate).toHaveBeenCalledTimes(1);
    }));

    it("should not perform a dry run if all files are removed", fakeAsync(() => {
      addFiles([modelData.file()]);

      fileImportSpy.dryCreate.calls.reset();
      removeFile(0);

      expect(fileImportSpy.dryCreate).not.toHaveBeenCalled();

      // we do expect that all of the identified events and files have been
      // removed from the page
      expect(eventTableRows()).toHaveLength(0);
      expect(fileListItems()).toHaveLength(0);
      expect(fileInput().files).toHaveLength(0);
    }));

    // Because all files are uploaded together, removing a file causes all of
    // the remaining files to be re-uploaded (dry run).
    // Therefore, we should see that the loading spinner is shown again.
    it("should enter a loading state after removing a file", fakeAsync(() => {
      addFiles([modelData.file(), modelData.file()]);

      // Delay the observable completing so that we can check the loading state
      // after removing a file.
      const response = new Subject();
      fileImportSpy.dryCreate.and.returnValue(response);

      removeFile(0);

      expect(fileListItems()[0]).toHaveDescendant("baw-loading");

      response.next(mockImportResponse);
      spec.detectChanges();

      // After the observable completes emits a value for the dry run, we should
      // see that the loading spinner is removed.
      expect(fileListItems()[0]).not.toHaveDescendant("baw-loading");
    }));
  });

  // the navigation warning depends on the UnsavedInputGuard
  // therefore, we can test that the "hasUnsavedChanges" getter returns the
  // correct value.
  // the assertions to check that this guard works correctly can be found in
  // the UnsavedInputGuard spec file
  describe("navigation warning", () => {
    it("should warn if the navigates without committing an uploaded file", fakeAsync(() => {
      addFiles([modelData.file()]);

      expect(spec.component.hasUnsavedChanges).toBeTrue();
    }));

    // This test is run in a fake async zone (even though it doesn't need to be)
    // so that this test is run in a similar environment to the other tests in
    // this suite.
    it("should not warn if the user has not staged files", fakeAsync(() => {
      expect(spec.component.hasUnsavedChanges).toBeFalse();
    }));

    it("should not warn if the user has committed their files", fakeAsync(() => {
      addFiles([modelData.file()]);
      commitImport();

      expect(spec.component.hasUnsavedChanges).toBeFalse();
    }));

    it("should warn if the user fails to commit their files", fakeAsync(() => {
      addFiles([modelData.file()]);

      // We simulate the dry run succeeding, but the commit failing.
      // To do this I override the create method to return an error
      // after I have added files and the dry run has succeeded.
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
    }));
  });

  describe("dry run", () => {
    it("should dry run a single file correctly", fakeAsync(() => {
      const file = modelData.file();
      addFiles([file]);

      expect(fileImportSpy.dryCreate).toHaveBeenCalledWith(
        jasmine.any(AudioEventImportFile),
        audioEventImport,
        null,
      );
    }));

    it("should dry run multiple files correctly", fakeAsync(() => {
      const testedFiles = [modelData.file(), modelData.file()];
      addFiles(testedFiles);

      // each file should be individually dry run through the api
      expect(fileImportSpy.dryCreate).toHaveBeenCalledTimes(2);

      testedFiles.forEach((file) => {
        expect(fileImportSpy.dryCreate).toHaveBeenCalledWith(
          jasmine.objectContaining({ file }),
          audioEventImport,
          null,
        );
      });
    }));

    it("should update the identified event table when a dry run completes", fakeAsync(() => {
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
            : "(missing)";

        const expectedErrorValue =
          event.errors.length > 0 ? event.errors.join("") : "No errors";

        const expectedRowValues = [
          `1:${i + 1}`,
          // event.audioRecordingId.toLocaleString(),
          mockRecordingsResponse.id.toString(),
          event.startTimeSeconds.toLocaleString(),
          event.endTimeSeconds.toLocaleString(),
          event.lowFrequencyHertz.toLocaleString(),
          event.highFrequencyHertz.toLocaleString(),
          event.channel.toLocaleString(),
          event.isReference ? "Yes" : "No",
          event.score.toLocaleString(),
          expectedTagValue,
          mockProvenanceResponse[0].toString(),
          expectedErrorValue,
        ];

        assertDatatableRow(row, expectedRowValues);
      });
    }));

    it("should enable the import button when a dry run completes", fakeAsync(() => {
      // because the default mock of the dry run api return an observable for a
      // valid dry run, we expect that the import button will be enabled
      // directly after adding files
      addFiles([modelData.file()]);
      expect(importFilesButton()).not.toBeDisabled();
    }));

    it("should disable the import button when performing a dry run", fakeAsync(() => {
      // we create an observable that never completes to simulate a dry run
      // that is still waiting for an api response
      fileImportSpy.dryCreate.and.callFake(() => new Observable());

      addFiles([modelData.file()]);

      expect(importFilesButton()).toBeDisabled();
    }));

    it("should disable the import button if there are errors in the dry run", fakeAsync(() => {
      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        mockImportResponse as any,
        { file: "validation failed" },
      );

      addFiles([modelData.file()]);

      expect(importFilesButton()).toBeDisabled();
    }));

    it("should remove the loading spinner when the dry run completes", fakeAsync(() => {
      // We provide a observable that we manually trigger so that we can assert
      // that the loading spinner is correctly shown when a dry run is in
      // progress and that it is removed when the dry run errors.
      const response = new Subject();
      fileImportSpy.dryCreate.and.returnValue(response);

      addFiles([modelData.file()]);

      expect(fileListItems()[0]).toHaveDescendant("baw-loading");

      response.next(mockImportResponse);
      spec.detectChanges();

      // After we send the dry run response, we should see that the loading
      // spinner is removed.
      expect(fileListItems()[0]).not.toHaveDescendant("baw-loading");
    }));
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
          null,
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
          null,
        );
      }));

      it("should start with no additional tags", fakeAsync(() => {
        addFiles([modelData.file(), modelData.file()]);
        expect(fileAdditionalTags(0)).toHaveLength(0);
      }));

      it("should enter a loading state when additional tags are added to a file", fakeAsync(() => {
        addFiles([modelData.file()]);

        const response = new Subject();
        fileImportSpy.dryCreate.and.returnValue(response);

        const testedTag = mockTagsResponse[0];
        addTagToFile(0, testedTag.text);

        expect(fileListItems()[0]).toHaveDescendant("baw-loading");

        response.next(mockImportResponse);
        spec.detectChanges();

        expect(fileListItems()[0]).not.toHaveDescendant("baw-loading");
      }));
    });

    describe("extra tags", () => {
      it("should add extra tags to every queued file", fakeAsync(() => {
        addFiles([modelData.file(), modelData.file()]);

        const testedTag = mockTagsResponse[0];
        addExtraTag(testedTag.text);

        expect(fileAdditionalTags(0)).toContain(testedTag.text);
      }));

      it("should clear the extra tags input once a tag is selected", fakeAsync(() => {
        addFiles([modelData.file(), modelData.file()]);

        const testedTag = mockTagsResponse[0];
        addExtraTag(testedTag.text);

        expect(extraTagsTypeahead().value).toHaveLength(0);
      }));
    });
  });

  describe("provenances", () => {
    describe("file provenance", () => {
      it("should perform a dry run when a provenance is added", fakeAsync(() => {
        addFiles([modelData.file()]);

        fileImportSpy.dryCreate.calls.reset();

        const testedProvenance = mockProvenanceResponse[0];
        addProvenanceToFile(0, testedProvenance.name);

        expect(fileImportSpy.dryCreate).toHaveBeenCalledOnceWith(
          jasmine.any(AudioEventImportFile),
          audioEventImport,
          testedProvenance.id,
        );
      }));

      it("should commit a files provenance when the import is committed", fakeAsync(() => {
        addFiles([modelData.file()]);

        const testedProvenance = mockProvenanceResponse[0];
        addProvenanceToFile(0, testedProvenance.name);

        commitImport();

        expect(fileImportSpy.create).toHaveBeenCalledWith(
          jasmine.any(AudioEventImportFile),
          audioEventImport,
          testedProvenance.id,
        );
      }));

      it("should start with no provenance", fakeAsync(() => {
        addFiles([modelData.file(), modelData.file()]);
        expect(fileProvenance(0)).toEqual("");
      }));

      it("should enter a loading state when a provenance is added to a file", fakeAsync(() => {
        addFiles([modelData.file()]);

        const response = new Subject();
        fileImportSpy.dryCreate.and.returnValue(response);

        const testedProvenance = mockProvenanceResponse[0];
        addProvenanceToFile(0, testedProvenance.name);

        expect(fileListItems()[0]).toHaveDescendant("baw-loading");

        response.next(mockImportResponse);
        spec.detectChanges();

        expect(fileListItems()[0]).not.toHaveDescendant("baw-loading");
      }));
    });

    // The "all files" provenance input can be used to apply a provenance to
    // every file in the current annotation import.
    describe("all files provenance", () => {
      it("should add provenances to every queued file", fakeAsync(() => {
        addFiles([modelData.file(), modelData.file()]);

        const testedProvenance = mockProvenanceResponse[0];
        addExtraProvenance(testedProvenance.name);

        expect(fileProvenance(0)).toEqual(testedProvenance.toString());
      }));

      it("should clear the extra provenance input once a tag is selected", fakeAsync(() => {
        addFiles([modelData.file(), modelData.file()]);

        const testedProvenance = mockProvenanceResponse[0];
        addExtraProvenance(testedProvenance.name);

        expect(extraProvenanceTypeahead().value).toHaveLength(0);
      }));
    });
  });

  describe("committing an annotation import", () => {
    it("should commit a single file correctly", fakeAsync(() => {
      addFiles([modelData.file()]);

      // we want to test that the commit api has not been called until we click
      // the import button
      expect(fileImportSpy.create).not.toHaveBeenCalled();

      // commitImport();

      // expect(fileImportSpy.create).toHaveBeenCalledWith(
      //   jasmine.any(AudioEventImportFile),
      //   audioEventImport
      // );
    }));

    it("should commit multiple files correctly", fakeAsync(() => {
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
          null,
        );
      });
    }));

    it("should navigate to the import details page when an import completes", fakeAsync(() => {
      const expectedRoute = `/projects/${routeProject.id}/import_annotations/${audioEventImport.id}`;

      addFiles([modelData.file()]);
      commitImport();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(expectedRoute);
    }));

    it("should display a toast notification when an import completes", fakeAsync(() => {
      addFiles([modelData.file()]);
      commitImport();
      expect(notificationsSpy.success).toHaveBeenCalledOnceWith(
        "Successfully imported annotations",
      );
    }));

    it("should enter a loading state when committing an import", fakeAsync(() => {
      addFiles([modelData.file()]);

      const response = new Subject();
      fileImportSpy.create.and.returnValue(response);

      commitImport();

      // while the create observable has not emitted, we should see a loading
      // spinner for the file being uploaded
      expect(fileListItems()[0]).toHaveDescendant("baw-loading");

      response.next(mockImportResponse);
      spec.detectChanges();

      // after the create completes, the loading spinner should be removed
      expect(fileListItems()[0]).not.toHaveDescendant("baw-loading");
    }));
  });

  describe("error handling", () => {
    // Because the api returns 422 responses if the dry run fails, we would
    // normally expect an error notification to be raised.
    // However, because we support more descriptive error messages in the
    // identified events table, we do not want to raise an error notification
    // if a dry run fails, and instead show the errors in the table.
    it("should not raise error notifications if a dry run fails", fakeAsync(() => {
      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        mockImportResponse as any,
        { file: "validation failed" },
      );

      // by adding files, we expect that the website will perform a dry run
      // and therefore, we expect that the api will return an error
      // however, we expect that he error will not be shown as a notification
      addFiles([modelData.file()]);

      expect(notificationsSpy.error).not.toHaveBeenCalledTimes(1);
      expect(notificationsSpy.error).not.toHaveBeenCalled();
    }));

    // We have error alerts for files because sometimes the server will fail
    // a dry run for reasons other than contents of the file.
    // e.g. an unsupported file type
    // In these cases, we want to show the error next to the file in the form
    // of an error alert.
    it("should show a single error alert if single file import fails", fakeAsync(() => {
      const mockErrorMessage =
        "is not unique. Duplicate recording found with id: 191";
      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        mockImportResponse as any,
        { file: mockErrorMessage },
      );

      const mockUploadedFile = modelData.file();
      addFiles([mockUploadedFile]);

      expect(fileAlerts()).toHaveLength(1);

      expect(fileAlerts()[0]).toHaveExactTrimmedText(mockErrorMessage);
    }));

    it("should show multiple error alerts if multiple file import fails", fakeAsync(() => {
      const mockErrorMessage = "validation failed";
      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        mockImportResponse as any,
        { file: mockErrorMessage },
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
    }));

    it("should show type errors if a field has an incorrect data type", fakeAsync(() => {
      const testEvent: IImportedAudioEvent = generateImportedAudioEvent({
        // We use "as any" here to bypass type checking because we want to
        // test invalid types being sent to the client from the server.
        channel: "this is a string" as any,
        errors: [{ channel: ["Channel must be a number"] }],
      });

      const testFile = new AudioEventImportFile(
        generateAudioEventImportFile({
          importedEvents: [testEvent],
        }),
        injectorSpy,
      );

      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        testFile,
        { file: "validation failed " },
      );

      const mockAudioFiles = [modelData.file()];
      addFiles(mockAudioFiles);

      const row = eventTableRows()[0];
      assertDatatableRow(row, [
        "1:1",
        mockRecordingsResponse.id.toString(),
        testEvent.startTimeSeconds.toLocaleString(),
        testEvent.endTimeSeconds.toLocaleString(),
        testEvent.lowFrequencyHertz.toLocaleString(),
        testEvent.highFrequencyHertz.toLocaleString(),
        "Type Error",
        testEvent.isReference ? "Yes" : "No",
        testEvent.score.toLocaleString(),
        testEvent.tags.map((tag) => tag.text).join(", "),
        mockProvenanceResponse[0].toString(),
        "channel: Channel must be a number",
      ]);
    }));

    it("should transition out of an uploading state if the dry run fails", fakeAsync(() => {
      // We provide a observable that we manually trigger so that we can assert
      // that the loading spinner is correctly shown when a dry run is in
      // progress and that it is removed when the dry run errors.
      const response = new Subject();
      fileImportSpy.dryCreate.and.returnValue(response);

      addFiles([modelData.file()]);

      expect(fileListItems()[0]).toHaveDescendant("baw-loading");

      mockImportResponse = new BawApiError(
        UNPROCESSABLE_ENTITY,
        "Unprocessable Content",
        mockImportResponse as any,
        { file: "validation failed" },
      );

      response.error(mockImportResponse);
      spec.detectChanges();

      // After we send the error response, we should see that the loading
      // spinner is removed.
      expect(fileListItems()[0]).not.toHaveDescendant("baw-loading");
    }));
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
        "Provenance",
        "Errors",
      ],
      rows: () => [],
    }));
  });
});
