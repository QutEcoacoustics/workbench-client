import { Component, ContentChild, input, TemplateRef } from "@angular/core";
import { BawErrorData } from "@interfaces/apiInterfaces";
import { NgTemplateOutlet } from "@angular/common";

export enum ErrorCardStyle {
  /** Styles the error card to fit inside a table cell */
  Inline,
  /** Styles the error card as a standalone alert notification */
  Alert,
}

interface ErrorTemplate {
  key: string;
  value: string;
}

@Component({
  selector: "baw-error-card",
  template: `
    <div class="error-container">
      @if (showSuccessState() && errors().length === 0) {
        <div class="error-output {{ divStyle }} {{ divStyle }}-success">
          No errors
        </div>
      }

      @for (error of errors(); track error) {
        @for (errorKey of extractErrorKeys(error); track errorKey) {
          <div class="error-output {{ divStyle }} {{ divStyle }}-danger">
            @if (errorTemplate) {
              <ng-container
                *ngTemplateOutlet="
                  errorTemplate;
                  context: {
                    key: errorKey,
                    value: extractErrorValues(error, errorKey),
                  }
                "
              ></ng-container>
            } @else {
              {{ errorKey }}:
              {{ extractErrorValues(error, errorKey) }}
            }
          </div>
        }
      }
    </div>
  `,
  styleUrl: "error-card.component.scss",
  imports: [NgTemplateOutlet],
})
export class ErrorCardComponent {
  public errors = input.required<ReadonlyArray<BawErrorData>>();
  public errorStyle = input<ErrorCardStyle>(ErrorCardStyle.Alert);
  public showSuccessState = input<boolean>(false);

  @ContentChild(TemplateRef) public errorTemplate?: TemplateRef<ErrorTemplate>;

  protected get divStyle(): string {
    return this.errorStyle() === ErrorCardStyle.Alert ? "alert" : "callout";
  }

  protected extractErrorKeys(error: BawErrorData) {
    return Object.keys(error);
  }

  protected extractErrorValues(error: BawErrorData, key: keyof BawErrorData) {
    return error[key];
  }
}
