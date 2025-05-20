import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { ImportAnnotationService } from "../services/import-annotation.service";
import { QueuedFile } from "../pages/add-annotations/add-annotations.component";
import { ImportInstructionsWidgetComponent } from "./instructions.component";

describe("ImportInstructionsWidgetComponent", () => {
  let spec: Spectator<ImportInstructionsWidgetComponent>;
  let annotationImportSpy: SpyObject<ImportAnnotationService>;

  const createComponent = createComponentFactory({
    component: ImportInstructionsWidgetComponent,
    imports: [IconsModule],
  });

  const uncommittedFileWarning = () => spec.query(".uncommitted-file-warning");
  const tagsWarning = () => spec.query(".tags-warning");

  function setFiles(mockFiles: QueuedFile[]): void {
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
        {},
        {},
        {},
      ] as any);

      expect(uncommittedFileWarning()).toExist();
    });
  });

  describe("error helpers", () => {
    it("should not show any errors if no files have been uploaded", () => {});

    it("should not show any error helpers if there are no errors", () => {});

    it("should show all error helpers if all errors are triggered", () => {});

    it("should only show the duplicate file error if there is only a duplicate file", () => {});
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
