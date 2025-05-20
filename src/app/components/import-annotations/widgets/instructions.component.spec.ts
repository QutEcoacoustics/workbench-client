import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { AudioEventImportFile } from "@models/AudioEventImportFile";
import { generateAudioEventImportFile } from "@test/fakes/AudioEventImportFile";
import { getElementByInnerText } from "@test/helpers/html";
import {
  ImportAnnotationService,
  ImportedFileWithErrors,
} from "../services/import-annotation.service";
import { ImportInstructionsWidgetComponent } from "./instructions.component";

function createMockImportFile(
  errors: Record<PropertyKey, string>[] = [],
): ImportedFileWithErrors {
  return {
    model: new AudioEventImportFile(generateAudioEventImportFile()),
    errors,
  };
}

describe("ImportInstructionsWidgetComponent", () => {
  let spec: Spectator<ImportInstructionsWidgetComponent>;
  let annotationImportSpy: SpyObject<ImportAnnotationService>;

  const createComponent = createComponentFactory({
    component: ImportInstructionsWidgetComponent,
    imports: [IconsModule],
    providers: [ImportAnnotationService],
  });

  // A wrapper component that contains all of the error messages.
  // You can use this selector to see if any errors are shown.
  const errorContainer = () => spec.query(".error-section");
  const uncommittedFileWarning = () => spec.query(".uncommitted-file-warning");
  const tagsWarning = () => spec.query(".tags-warning");

  function hasEventErrors(): boolean {
    return !!getElementByInnerText(spec, "Event errors");
  }

  function hasDuplicateFileErrors(): boolean {
    return !!getElementByInnerText(spec, "Duplicate files");
  }

  function setFiles(mockFiles: ImportedFileWithErrors[]): void {
    annotationImportSpy.importFileModel.set(mockFiles);
    spec.detectChanges();
  }

  function setup(): void {
    spec = createComponent({ detectChanges: false });

    annotationImportSpy = spec.inject(ImportAnnotationService);

    spec.detectChanges();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ImportInstructionsWidgetComponent);
  });

  describe("uncommitted warning", () => {
    it("should not show a warning if there are no pending files", () => {
      expect(uncommittedFileWarning()).not.toExist();
    });

    it("should show a file warning if there are pending files", () => {
      setFiles([
        createMockImportFile(),
        createMockImportFile(),
        createMockImportFile(),
      ]);

      expect(uncommittedFileWarning()).toExist();
    });
  });

  describe("error helpers", () => {
    it("should not show any errors if no files have been uploaded", () => {
      expect(errorContainer()).not.toExist();
    });

    it("should not show any error helpers if there are no errors", () => {
      setFiles([
        createMockImportFile(),
        createMockImportFile(),
        createMockImportFile(),
      ]);

      expect(errorContainer()).not.toExist();
    });

    it("should show even event error card if there is only event errors", () => {
      // In this example, we set two files where one of them does not have any
      // errors. I purposely do this as it tests the limits of the component.
      setFiles([
        createMockImportFile(),
        createMockImportFile([{ 0: "Validation failed" }]),
      ]);

      expect(hasEventErrors()).toBeTrue();
    });

    // We test both event errors and duplicate errors because they are returned
    // in slightly different formats from the API.
    // While event errors come with the predictable "Validation failed" error
    // message, duplicate file errors are dynamic as they contain the file id
    // of the duplicate file.
    it("should only show the duplicate file error if there is only a duplicate file", () => {
      expect(hasDuplicateFileErrors()).toBeTrue();
    });
  });

  describe("tag warning", () => {
    it("should not show any warnings if no files have been uploaded", () => {
      expect(tagsWarning()).not.toExist();
    });

    it("should not show any warnings if the uploaded file has no warnings", () => {
      expect(tagsWarning()).not.toExist();
    });

    it("should show warnings if the uploaded file has missing tags", () => {
      expect(tagsWarning()).toExist();
    });
  });
});
