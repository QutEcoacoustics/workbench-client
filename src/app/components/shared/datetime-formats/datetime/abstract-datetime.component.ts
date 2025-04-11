import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  input,
} from "@angular/core";
import { DateTime, IANAZone, Zone } from "luxon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { AbstractTemplateComponent } from "../abstract-template.component";

export type InputTypes = DateTime | Date | string;

@Component({
  templateUrl: "../abstract-template.component.html",
  imports: [NgbTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export abstract class AbstractDatetimeComponent extends AbstractTemplateComponent<
  InputTypes,
  DateTime
> {
  public constructor() {
    super();
  }

  public date = input<boolean, string>(false, { transform: booleanAttribute });
  public time = input<boolean, string>(false, { transform: booleanAttribute });

  protected abstract extractTimezone(): Zone;

  // this method returns the timezone name and offset
  // eg. "+08:00 Australia/Perth"
  // we use this method to display the full timezone name and offset in the tooltip
  public static formatTimezone(zone: Zone, dateTime: DateTime): string {
    const timezoneName = zone.name;
    const offsetValue = zone.formatOffset(dateTime.toMillis(), "short");

    // if we know the offset, but not timezone, we only want to return the offset
    if (!IANAZone.isValidZone(timezoneName) || timezoneName === offsetValue) {
      return offsetValue;
    }

    return `${offsetValue} ${timezoneName}`;
  }

  public update(): void {
    const value = this.value();
    const zone = this.extractTimezone();
    const valueInZone = value.setZone(zone);

    const timezoneName = AbstractDatetimeComponent.formatTimezone(zone, value);

    const tooltipDateTime = valueInZone.toFormat(
      AbstractTemplateComponent.TOOLTIP_DATETIME
    );

    // we do not place the timezoneName in brackets as the ngx-bootstrap tooltip
    // is an "absolute" width. This means that the brackets will be split over multiple lines
    // degrading the readability of the tooltip and user experience
    this.tooltipText = `${tooltipDateTime} ${timezoneName}`;
    this.documentText = valueInZone.toFormat(this.dateTimeFormat());
    this.isoDateTime = valueInZone.toISO();
  }

  protected override normalizeValue(value: InputTypes): DateTime {
    if (typeof value === "string") {
      return DateTime.fromISO(value);
    }

    return value instanceof DateTime ? value : DateTime.fromJSDate(value);
  }

  private dateTimeFormat(): string {
    const showDate = this.date();
    const showTime = this.time();

    if (showDate && showTime) {
      return AbstractDatetimeComponent.FULL_DATETIME;
    } else if (showDate) {
      return AbstractDatetimeComponent.DATE_ONLY;
    } else if (showTime) {
      return AbstractDatetimeComponent.SEXAGESIMAL;
    }

    // include both date and time if neither dateOnly or timeOnly are specified
    return AbstractDatetimeComponent.FULL_DATETIME;
  }

  protected static readonly FULL_DATETIME = "yyyy-MM-dd HH:mm:ss";
  protected static readonly DATE_ONLY = "yyyy-MM-dd";
  protected static readonly SEXAGESIMAL = "HH:mm:ss";
}
