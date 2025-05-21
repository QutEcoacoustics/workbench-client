import {
  ChangeDetectionStrategy,
  Component,
  computed,
  Signal,
} from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { WidgetComponent } from "@menu/widget.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { contactUsMenuItem } from "@components/about/about.menus";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { EventImportError } from "@models/AudioEventImport/ImportedAudioEvent";
import {
  ImportAnnotationService,
  ImportedFileWithErrors,
} from "../services/import-annotation.service";

type ErrorPredicate = string | ((value: string) => boolean);

@Component({
  selector: "baw-import-instructions",
  templateUrl: "./instructions.component.html",
  styleUrl: "./instructions.component.scss",
  imports: [FaIconComponent, StrongRouteDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImportInstructionsWidgetComponent implements WidgetComponent {
  public constructor(protected annotationImport: ImportAnnotationService) {
    this.importFiles = this.annotationImport.connect();
  }

  protected contactUs = contactUsMenuItem;

  protected importFiles: Signal<ImportedFileWithErrors[]>;
  protected hasUncommittedFiles = computed(() => this.importFiles().length > 0);

  protected hasEventErrors = this.hasError("Validation failed");
  protected hasUnsupportedFormat = this.hasError(
    "is not an acceptable content type",
  );
  protected hasDuplicateFiles = this.hasError((value) =>
    value.toLowerCase().includes("duplicate record"),
  );
  protected hasServerError = this.hasError((value) =>
    value.toLowerCase().includes("internal server error"),
  );

  /**
   * Creates a new readonly computed signal that can be used to
   */
  private hasError(predicate: ErrorPredicate): Signal<boolean> {
    return computed(() => {
      const importErrors = this.annotationImport
        .importErrors()
        .flatMap((errors) => Object.values(errors))
        .flat();

      return this.processQuery(predicate, importErrors);
    });
  }

  private processQuery(predicate: ErrorPredicate, errors: string[]): boolean {
    if (typeof predicate === "string") {
      return errors.includes(predicate);
    }

    return errors.some((value) => predicate(value));
  }
}

export const importAnnotationsWidgetMenuItem = new WidgetMenuItem(
  ImportInstructionsWidgetComponent,
);
