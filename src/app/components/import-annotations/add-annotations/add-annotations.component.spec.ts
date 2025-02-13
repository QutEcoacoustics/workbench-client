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
import { AUDIO_EVENT_IMPORT_FILE } from "@baw-api/ServiceTokens";
import { assertPageInfo } from "@test/helpers/pageRoute";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { modelData } from "@test/helpers/faker";
import { generateAudioEventImportFile } from "@test/fakes/AudioEventImportFile";
import { clickButton, inputFile } from "@test/helpers/html";
import { generateAudioEventImport } from "@test/fakes/AudioEventImport";
import { AddAnnotationsComponent } from "./add-annotations.component";

describe("AddAnnotationsComponent", () => {
  let spectator: Spectator<AddAnnotationsComponent>;

  let eventFileImportApi: SpyObject<AudioEventImportFileService>;
  let notificationsSpy: SpyObject<ToastrService>;

  let audioEventImport: AudioEventImport;
  let mockImportResponse: AudioEventImportFile[];

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
  const eventsTable = () => spectator.query<HTMLTableElement>("ngx-datatable");

  function commitImport(): void {
    clickButton(spectator, importFilesButton());
  }

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    // TODO: this should probably mock the route resolver
    spectator.component.audioEventImport = audioEventImport;

    eventFileImportApi = spectator.inject(AUDIO_EVENT_IMPORT_FILE.token);
    notificationsSpy = spectator.inject(ToastrService);

    notificationsSpy.success.and.stub();
    notificationsSpy.error.and.stub();

    eventFileImportApi.create.and.callFake(() => mockImportResponse);
    eventFileImportApi.dryCreate.and.callFake(() => mockImportResponse);

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

      inputFile(spectator, fileInput(), [testFile]);

      expect(eventFileImportApi.dryCreate).toHaveBeenCalledWith(
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

      inputFile(spectator, fileInput(), [testFile]);

      expect(eventFileImportApi.dryCreate).toHaveBeenCalledWith(
        jasmine.objectContaining({
          file: jasmine.objectContaining({ type: "text/csv" }),
        }),
        audioEventImport
      );

    });

    it("should not change the type of an excel file", () => {
      const testFile = modelData.file({ name: "test.xlsx", type: "application/vnd.ms-excel" });

      inputFile(spectator, fileInput(), [testFile]);

      expect(eventFileImportApi.dryCreate).toHaveBeenCalledWith(
        jasmine.objectContaining({
          file: jasmine.objectContaining({ type: "application/vnd.ms-excel" }),
        }),
        audioEventImport
      );
    });
  });

  describe("navigation warning", () => {
    it("should warn if the navigates without committing an uploaded file", () => {});

    it("should not warn if the user did not upload any files", () => {});
  });

  describe("dry run", () => {
    it("should dry run a single file correctly", () => {
      const file = modelData.file();
      inputFile(spectator, fileInput(), [file]);

      expect(eventFileImportApi.dryCreate).toHaveBeenCalledWith(
        jasmine.any(AudioEventImportFile),
        audioEventImport
      );
    });

    it("should dry run multiple files correctly", () => {
      const files = [modelData.file(), modelData.file()];
      inputFile(spectator, fileInput(), files);

      // expect(eventFileImportApi.dryCreate).toHaveBeenCalledTimes(2);
    });

    it("should update the identified event table when a dry run completes", () => {});

    it("should disable the import button when performing a dry run", () => {});

    it("should disable the import button if there are errors in the dry run", () => {});
  });

  describe("committing an annotation import", () => {
    it("should commit a single file correctly", () => {});

    it("should commit multiple files correctly", () => {});

    it("should navigate to the import details page when an import completes", () => {});

    it("should display a toast notification when an import completes", () => {});
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
      service: eventFileImportApi,
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
