import { Component, Input, booleanAttribute } from "@angular/core";
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
})
export class DurationComponent extends AbstractTemplateComponent<InputType, Duration> {
  public constructor() {
    super();
  }

  // an empty string is used to indicate that the attribute is present
  // eg. <baw-duration humanized> will cause the humanized attribute to be set to an empty string ("")
  @Input({ transform: booleanAttribute }) public humanized?: boolean;
  @Input({ transform: booleanAttribute }) public iso8601?: boolean;
  @Input({ transform: booleanAttribute }) public sexagesimal?: boolean;

  public update(): void {
    this.isoDateTime = this.value.toISO();
    this.documentText = this.formattedValue();
    this.tooltipText = this.tooltipValue();
  }

  // if no format operator is supplied, the component will default to sexagesimal format
  public formattedValue(): string {
    if (this.humanized) {
      const relativePrefix = this.value.valueOf() < 0 ? "-" : "";
      return relativePrefix + toRelative(this.value, { largest: 2, round: true });
    } else if (this.iso8601) {
      return this.value.toISO();
    } else if (this.sexagesimal) {
      return this.value.toFormat(DurationComponent.DURATION_SEXAGESIMAL);
    }

    return this.value.toFormat(DurationComponent.DURATION_SEXAGESIMAL);
  }

  public tooltipValue(): string {
    const tooltipFormat = DurationComponent.DURATION_SEXAGESIMAL;
    const sexagesimalDuration = this.value.toFormat(tooltipFormat);

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

  protected static readonly DURATION_SEXAGESIMAL = "hh:mm:ss.SS" as const;
}
