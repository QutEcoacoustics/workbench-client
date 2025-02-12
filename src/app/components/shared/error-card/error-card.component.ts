import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { BawDataError } from "@interfaces/apiInterfaces";

@Component({
  selector: "baw-error-card",
  template: `
    @if (showSuccessState() && errors().length === 0) {
      <div class="error-card callout callout-success">
        No errors
      </div>
    }

    @for (error of errors(); track error) {
      @for (errorKey of extractErrorKeys(error); track errorKey) {
        <div class="error-card callout callout-danger">
          {{ errorKey }}:
          {{ extractErrorValues(error, errorKey) }}
        </div>
      }
    }
 `,
  styleUrl: "error-card.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorCardComponent {
  public errors = input.required<BawDataError[]>();
  public showSuccessState = input<boolean>(false);

  protected extractErrorKeys(error: BawDataError) {
    return Object.keys(error);
  }

  protected extractErrorValues(error: BawDataError, key: keyof BawDataError) {
    return error[key];
  }
}
