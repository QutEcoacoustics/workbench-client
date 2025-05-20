import { ChangeDetectionStrategy, Component, computed } from "@angular/core";
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
    () => this.annotationImport.importFileModel().size > 0,
  );

  protected hasError(errorQuery: string): boolean {
    const errors = this.annotationImport.importErrors();
    return errors.some((error) => errorQuery in error);
  }
}

export const importAnnotationsWidgetMenuItem = new WidgetMenuItem(
  ImportInstructionsWidgetComponent,
);
