import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input
} from "@angular/core";
import { toRelative } from "@interfaces/apiInterfaces";
import { Duration } from "luxon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { AbstractTemplateComponent } from "../abstract-template.component";

type InputType = Duration | string;

@Component({
  selector: "baw-duration",
  templateUrl: "../abstract-template.component.html",
  standalone: true,
  imports: [NgbTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DurationComponent extends AbstractTemplateComponent<InputType, Duration> {
  public constructor() {
    super();
  }

  // an empty string is used to indicate that the attribute is present
  // eg. <baw-duration humanized> will cause the humanized attribute to be set to an empty string ("")
  public humanized = input<boolean, string>(false, { transform: booleanAttribute });
  public iso8601 = input<boolean, string>(false, { transform: booleanAttribute });
  public sexagesimal = input<boolean, string>(false, { transform: booleanAttribute });

  public update(): void {
    const value = this.value();

    this.isoDateTime = value.toISO();
    this.documentText = this.formattedValue(value);
    this.tooltipText = this.tooltipValue(value);
  }

  // if no format operator is supplied, the component will default to sexagesimal format
  public formattedValue(value: Duration): string {
    const humanizedFormat = this.humanized();
    const iso8601Format = this.iso8601();
    const sexagesimalFormat = this.sexagesimal();

    if (humanizedFormat) {
      const relativePrefix = value.valueOf() < 0 ? "-" : "";
      return relativePrefix + toRelative(value, { largest: 2, round: true });
    } else if (iso8601Format) {
      return value.toISO();
    } else if (sexagesimalFormat) {
      return value.toFormat(DurationComponent.DURATION_SEXAGESIMAL);
    }

    return value.toFormat(DurationComponent.DURATION_SEXAGESIMAL);
  }

  public tooltipValue(value: Duration): string {
    const tooltipFormat = DurationComponent.DURATION_SEXAGESIMAL;
    const sexagesimalDuration = value.toFormat(tooltipFormat);

    return `${sexagesimalDuration} (${this.isoDateTime})`;
  }

  protected override normalizeValue(value: InputType): Duration {
    let luxonDuration: Duration;

    if (typeof value === "string") {
      luxonDuration = Duration.fromISO(value);
    } else {
      luxonDuration = value;
    }

    return luxonDuration.rescale();
  }

  protected static readonly DURATION_SEXAGESIMAL = "hh:mm:ss.SS";
}
