import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal,
} from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { WidgetComponent } from "@menu/widget.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { ImportAnnotationService } from "../services/import-annotation.service";

@Component({
  selector: "baw-import-instructions",
  templateUrl: "./instructions.component.html",
  styleUrl: "./instructions.component.scss",
  imports: [FaIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportInstructionsWidgetComponent implements WidgetComponent {
  public constructor(protected annotationImport: ImportAnnotationService) {}

  protected hasUncommittedFiles = computed(
    () => this.annotationImport.importFileModel().length > 0,
  );

  protected hasEventErrors = this.hasError("Validation failed");
  protected hasDuplicateFiles = this.hasError("duplicate");
  protected hasUnsupportedFormat = this.hasError("unsupported");

  protected hasMissingTags = this.hasWarning("Missing tags");

  protected hasError(errorQuery: string): Signal<boolean> {
    return computed(() => {
      return this.annotationImport
        .importErrors()
        .some((error) => Object.values(error).flat().includes(errorQuery));
    });
  }

  protected hasWarning(warningQuery: string): Signal<boolean> {
    return computed(() => false);
  }
}

export const importAnnotationsWidgetMenuItem = new WidgetMenuItem(
  ImportInstructionsWidgetComponent,
);
