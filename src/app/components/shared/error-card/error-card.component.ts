import { ChangeDetectionStrategy, Component, input } from "@angular/core";

type BawDataError = any;

@Component({
  selector: "baw-error-card",
  templateUrl: "error-card.component.html",
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

  protected humanReadableKey(key: string) {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }
}
