import { createComponentFactory, Spectator } from "@ngneat/spectator";
import { IconsModule } from "@shared/icons/icons.module";
import { ImportInstructionsWidgetComponent } from "./instructions.component";

describe("ImportInstructionsWidgetComponent", () => {
  let spec: Spectator<ImportInstructionsWidgetComponent>;

  const createComponent = createComponentFactory({
    component: ImportInstructionsWidgetComponent,
    imports: [IconsModule],
  });

  function setup(): void {
    spec = createComponent();
  }

  beforeEach(() => {
    setup();
  });

  it("should create", () => {
    expect(spec.component).toBeInstanceOf(ImportInstructionsWidgetComponent);
  });

  describe("uncommitted warning", () => {
    it("should not show a warning if there are no pending files", () => {});

    it("should show a file warning if there are pending files", () => {});
  });

  describe("error helpers", () => {
    it("should not show any errors if no files have been uploaded", () => {});

    it("should not show any error helpers if there are no errors", () => {});

    it("should show all error helpers if all errors are triggered", () => {});

    it("should only show the duplicate file error if there is only a duplicate file", () => {});
  });

  describe("tag warning", () => {
    it("should not show any warnings if no files have been uploaded", () => {});

    it("should not show any warnings if the uploaded file has no warnings", () => {});

    it("should show warnings if the uploaded file has missing tags", () => {});
  });
});
