import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "baw-indicator",
  templateUrl: "./indicator.component.html",
  styleUrls: ["./indicator.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorComponent {
  @Input() status: Status = Status.Success;
  public Status = Status;
}

export enum Status {
  Success,
  Warning,
  Error,
}
