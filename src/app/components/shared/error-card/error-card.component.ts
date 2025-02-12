import { Component, input } from "@angular/core";
import { BawDataError } from "@interfaces/apiInterfaces";

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
      <div class="error-card {{ divStyle }} {{ divStyle }}-success">
        No errors
      </div>
    }

    @for (error of errors(); track error) {
      @for (errorKey of extractErrorKeys(error); track errorKey) {
        <div class="error-card {{ divStyle }} {{ divStyle }}-danger">
          {{ errorKey }}:
          {{ extractErrorValues(error, errorKey) }}
        </div>
      }
    }
 `,
  styleUrl: "error-card.component.scss",
})
export class ErrorCardComponent {
  public errors = input.required<BawDataError[]>();
  public errorStyle = input<ErrorCardStyle>(ErrorCardStyle.Alert);
  public showSuccessState = input<boolean>(false);

  protected get divStyle(): string {
    return this.errorStyle() === ErrorCardStyle.Alert
      ? "alert"
      : "callout";
  }

  protected extractErrorKeys(error: BawDataError) {
    return Object.keys(error);
  }

  protected extractErrorValues(error: BawDataError, key: keyof BawDataError) {
    return error[key];
  }
}
