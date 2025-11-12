import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  WritableSignal,
  effect,
  signal,
} from "@angular/core";
import { toRelative } from "@interfaces/apiInterfaces";
import { DateTime, Duration } from "luxon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractTemplateComponent } from "../abstract-template.component";
import { AbstractDatetimeComponent } from "../datetime/abstract-datetime.component";

type InputType = Duration | DateTime | Date;

@Component({
  selector: "baw-time-since",
  templateUrl: "../abstract-template.component.html",
  styleUrl: "./time-since.component.scss",
  imports: [NgbTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimeSinceComponent extends AbstractTemplateComponent<
  InputType,
  DateTime
> {
  public constructor(private changeDetector: ChangeDetectorRef) {
    super();

    effect(() => {
      const now = TimeSinceComponent.tick();
      const valueDelta = now.diff(this.value());
      const lastChangeDelta = now.diff(this.lastChange);

      if (
        Math.abs(valueDelta.as("seconds")) <= 60 ||
        Math.abs(lastChangeDelta.as("seconds")) >= 60
      ) {
        this.update();

        // normal input signal fields mark a component for changes
        // since the static tick() function is an ordinary writable signal
        // we need to manually mark the component as dirty to trigger change detection
        this.changeDetector.markForCheck();
        this.lastChange = now;
      }
    });
  }

  private lastChange = DateTime.now();

  public update(): void {
    const value = this.value();

    const tooltipDate = value.toFormat(
      AbstractTemplateComponent.TOOLTIP_DATETIME
    );
    const tooltipZone = AbstractDatetimeComponent.formatTimezone(
      value.zone,
      value
    );

    const durationSince = value.diffNow().rescale();

    const relativeTime = toRelative(durationSince, {
      largest: 2,
      round: true,
    });

    this.tooltipText = `${tooltipDate} ${tooltipZone}`;
    this.isoDateTime = durationSince.toISO();
    this.documentText = relativeTime;

    // if the duration is positive, it implies that the date/time is in the future
    // therefore, we want to change the suffix from "ago" to "from now"
    if (durationSince.valueOf() > 0) {
      this.suffix = "from now";
    } else {
      this.suffix = "ago";
    }
  }

  protected override normalizeValue(value: InputType): DateTime {
    let dateTimeObject: DateTime;

    if (value instanceof Duration) {
      dateTimeObject = DateTime.now().plus(value);
    } else if (value instanceof Date) {
      dateTimeObject = DateTime.fromJSDate(value);
    } else {
      dateTimeObject = value;
    }

    return dateTimeObject.toLocal();
  }

  private static tickValue: WritableSignal<DateTime>;

  public static get tick(): WritableSignal<DateTime> {
    if (!isInstantiated(TimeSinceComponent.tickValue)) {
      TimeSinceComponent.tickValue = signal(DateTime.now());

      setInterval(() => {
        TimeSinceComponent.tickValue?.set(DateTime.now());
      }, 1000);
    }

    return TimeSinceComponent.tickValue;
  }
}
