import { Component, ContentChild, input, TemplateRef } from "@angular/core";
import { BawErrorData } from "@interfaces/apiInterfaces";

export enum ErrorCardStyle {
  /** Styles the error card to fit inside a table cell */
  Inline,
  /** Styles the error card as a standalone alert notification */
  Alert,
}

@Component({
  selector: "baw-error-card",
  template: `
    @if (showSuccessState() && errors().length === 0) {
      <div class="error-output {{ divStyle }} {{ divStyle }}-success">
        No errors
      </div>
    }

    @for (error of errors(); track error) {
      @for (errorKey of extractErrorKeys(error); track errorKey) {
        <div class="error-output {{ divStyle }} {{ divStyle }}-danger">
          @if (errorTemplate) {
            <ng-container *ngTemplateOutlet="
              errorTemplate;
              context: {
                key: errorKey,
                value: extractErrorValues(error, errorKey),
                }
            "></ng-container>
          } @else {
            {{ errorKey }}:
            {{ extractErrorValues(error, errorKey) }}
          }
        </div>
      }
    }
 `,
  styleUrl: "error-card.component.scss",
})
export class ErrorCardComponent {
  public errors = input.required<ReadonlyArray<BawErrorData>>();
  public errorStyle = input<ErrorCardStyle>(ErrorCardStyle.Alert);
  public showSuccessState = input<boolean>(false);

  @ContentChild(TemplateRef) public errorTemplate?: TemplateRef<any>;

  protected get divStyle(): string {
    return this.errorStyle() === ErrorCardStyle.Alert
      ? "alert"
      : "callout";
  }

  protected extractErrorKeys(error: BawErrorData) {
    return Object.keys(error);
  }

  protected extractErrorValues(error: BawErrorData, key: keyof BawErrorData) {
    return error[key];
  }
}
