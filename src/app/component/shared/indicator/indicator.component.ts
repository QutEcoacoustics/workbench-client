import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
  selector: "app-indicator",
  templateUrl: "./indicator.component.html",
  styleUrls: ["./indicator.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorComponent {
  @Input() status: Status = Status.Success;
  public options = Status;
}

export enum Status {
  Success,
  Warning,
  Error,
}
