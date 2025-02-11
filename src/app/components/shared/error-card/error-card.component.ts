import { ChangeDetectionStrategy, Component, input } from "@angular/core";

export type BawDataError = any;

@Component({
  selector: "baw-error-card",
  template: `
    <!-- prettier-ignore -->
    @for (error of errors(); track error) {
      @for (errorKey of extractErrorKeys(error); track errorKey) {
        <!-- <summary>
          <strong>{{ errorKey }}</strong>
          <span class="chevron">
            <fa-icon [icon]="['fas', 'chevron-up']"></fa-icon>
          </span>
        </summary> -->

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

  protected extractErrorKeys(error: BawDataError) {
    return Object.keys(error);
  }

  protected extractErrorValues(error: BawDataError, key: keyof BawDataError) {
    return error[key];
  }
}
