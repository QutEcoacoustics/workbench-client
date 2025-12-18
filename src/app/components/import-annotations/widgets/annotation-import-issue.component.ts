import { ChangeDetectionStrategy, Component, computed, Signal, inject } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { WidgetComponent } from "@menu/widget.component";
import { WidgetMenuItem } from "@menu/widgetItem";
import { contactUsMenuItem } from "@components/about/about.menus";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";
import { NgTemplateOutlet } from "@angular/common";
import {
  ImportAnnotationService,
  ImportedFileWithErrors,
} from "../services/import-annotation.service";

type ErrorPredicate = string | ((value: string) => boolean);

@Component({
  selector: "baw-annotation-import-issue-widget",
  templateUrl: "./annotation-import-issue.component.html",
  imports: [FaIconComponent, StrongRouteDirective, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotationImportIssueWidgetComponent implements WidgetComponent {
  protected readonly annotationImport = inject(ImportAnnotationService);

  public constructor() {
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
   * Creates a new readonly computed signal that conditionally updates if the
   * predicate returns true, or the error is equal to the predicate string.
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

export const annotationImportIssueWidgetMenuItem = new WidgetMenuItem(
  AnnotationImportIssueWidgetComponent,
);
