import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from "@angular/core";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: "app-indicator",
  templateUrl: "./indicator.component.html",
  styleUrls: ["./indicator.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndicatorComponent implements OnInit {
  @Input() status: Status = Status.Success;
  public color: string;
  public icon: IconProp;
  public width: string;

  ngOnInit() {
    if (this.status === Status.Success) {
      this.color = "limegreen";
      this.icon = ["fas", "check"];
      this.width = "14px";
    } else if (this.status === Status.Error) {
      this.color = "red";
      this.icon = ["fas", "times"];
      this.width = "10px";
    } else {
      this.color = "orange";
      this.icon = ["fas", "exclamation-triangle"];
      this.width = "19px";
    }
  }
}

export enum Status {
  Success,
  Warning,
  Error,
}
