import { createRoutingFactory, Spectator, SpyObject } from "@ngneat/spectator";
import { AudioEventImport } from "@models/AudioEventImport";
import { InlineListComponent } from "@shared/inline-list/inline-list.component";
import { TypeaheadInputComponent } from "@shared/typeahead-input/typeahead-input.component";
import { LoadingComponent } from "@shared/loading/loading.component";
import { SharedModule } from "@shared/shared.module";
import { MockBawApiModule } from "@baw-api/baw-apiMock.module";
import { ToastrService } from "ngx-toastr";
import { assertDatatable } from "@test/helpers/datatable";
import { AudioEventImportFileService } from "@baw-api/audio-event-import-file/audio-event-import-file.service";
import { AUDIO_EVENT_IMPORT_FILE, TAG } from "@baw-api/ServiceTokens";
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
import { fakeAsync } from "@angular/core/testing";
import { of } from "rxjs";
import { Router } from "@angular/router";
import { AddAnnotationsComponent } from "./add-annotations.component";

describe("AddAnnotationsComponent", () => {
  let spectator: Spectator<AddAnnotationsComponent>;

  let fileImportSpy: SpyObject<AudioEventImportFileService>;
  let tagServiceSpy: SpyObject<TagsService>;
  let notificationsSpy: SpyObject<ToastrService>;
  let routerSpy: SpyObject<Router>;

  let audioEventImport: AudioEventImport;
  let mockImportResponse: AudioEventImportFile[];
  let mockTagsResponse: Tag[];

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
  const importFilesButton = () =>
    spectator.query<HTMLButtonElement>("#import-btn");
  const additionalTagsInput = () =>
    spectator.query<HTMLElement>("#additional-tags-input");
  const eventsTable = () => spectator.query<HTMLTableElement>("ngx-datatable");

  function addFiles(files: File[]): void {
    inputFile(spectator, fileInput(), files);
  }

  function commitImport(): void {
    clickButton(spectator, importFilesButton());
  }

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    // TODO: this should probably mock the route resolver
    spectator.component.audioEventImport = audioEventImport;

    fileImportSpy = spectator.inject(AUDIO_EVENT_IMPORT_FILE.token);
    tagServiceSpy = spectator.inject(TAG.token);
    notificationsSpy = spectator.inject(ToastrService);
    routerSpy = spectator.inject(Router);

    notificationsSpy.success.and.stub();
    notificationsSpy.error.and.stub();

    fileImportSpy.create.and.callFake(() => of(mockImportResponse));
    fileImportSpy.dryCreate.and.callFake(() => of(mockImportResponse));

    tagServiceSpy.filter.and.callFake(() => of(mockTagsResponse));

    spectator.detectChanges();
  }

  beforeEach(() => {
    audioEventImport = new AudioEventImport(generateAudioEventImport());

    mockImportResponse = modelData.randomArray(
      1,
      10,
      () =>
        new AudioEventImportFile(
          generateAudioEventImportFile({
            audioEventImportId: audioEventImport.id,
          })
        )
    );

    mockTagsResponse = modelData.randomArray(
      1,
      10,
      () => new Tag(generateTag())
    );

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

    it("should warn if the user has added additional tags", fakeAsync(() => {
      const selectedTag = mockTagsResponse[0];
      selectFromTypeahead(spectator, additionalTagsInput(), selectedTag.text);

      expect(spectator.component.hasUnsavedChanges).toBeTrue();
    }));

    it("should not warn if the user did not upload any files", () => {
      expect(spectator.component.hasUnsavedChanges).toBeFalse();
    });
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

    it("should update the identified event table when a dry run completes", () => {});

    it("should disable the import button when performing a dry run", () => {});

    it("should disable the import button if there are errors in the dry run", () => {});
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
    it("should not raise error notifications if a dry run fails", () => {});

    it("should not show a success alert if a dry run succeeds", () => {});

    it("should show a single error alert if single file import fails", () => {});

    it("should show multiple error alerts if multiple file import fails", () => {});
  });

  xdescribe("identified events table", () => {
    assertDatatable(() => ({
      root: () => eventsTable(),
      service: fileImportSpy,
      columns: [
        "Recording",
        "Start Time",
        "End Time",
        "Low Frequency",
        "High Frequency",
        "Tags",
        "Errors",
      ],
      rows: [],
    }));
  });
});
