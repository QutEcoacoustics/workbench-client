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
import { AddAnnotationsComponent } from "./add-annotations.component";

describe("AddAnnotationsComponent", () => {
  let spectator: Spectator<AddAnnotationsComponent>;

  let eventFileImportApi: SpyObject<AudioEventImportFileService>;
  let notificationsSpy: SpyObject<ToastrService>;

  let audioEventImport: AudioEventImport;

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
      resolvers: { model: audioEventImport },
    },
  });

  function eventsTable(): Element {
    return spectator.query("ngx-datatable");
  }

  function setup(): void {
    spectator = createComponent({ detectChanges: false });

    eventFileImportApi = spectator.inject(AUDIO_EVENT_IMPORT_FILE.token);
    notificationsSpy = spectator.inject(ToastrService);

    spyOn(notificationsSpy, "success").and.stub();
    spyOn(notificationsSpy, "error").and.stub();

    spectator.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spectator.component).toBeInstanceOf(AddAnnotationsComponent);
  });

  it("should disable the import button if no files are uploaded", () => {});

  describe("navigation warning", () => {
    it("should warn if the navigates without committing an uploaded file", () => {});

    it("should not warn if the user did not upload any files", () => {});
  });

  describe("dry run", () => {
    it("should dry run a single file correctly", () => {});

    it("should dry run multiple files correctly", () => {});

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

  describe("identified events table", () => {
    assertDatatable(() => ({
      root: () => eventsTable(),
      service: eventFileImportApi,
      columns: [],
      rows: [],
    }));
  });
});
