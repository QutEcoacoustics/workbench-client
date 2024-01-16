import { Component, OnInit } from "@angular/core";
import { toRelative } from "@interfaces/apiInterfaces";
import { DateTime, Duration } from "luxon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { interval } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AbstractTemplateComponent } from "../abstract-template.component";
import { AbstractDatetimeComponent } from "../datetime/abstract-datetime.component";

type InputType = Duration | DateTime | Date;

@Component({
  selector: "baw-time-since",
  templateUrl: "../abstract-template.component.html",
  styleUrls: ["time-since.component.scss"],
  standalone: true,
  imports: [NgbTooltipModule],
})
export class TimeSinceComponent
  extends AbstractTemplateComponent<InputType, DateTime>
  implements OnInit
{
  public constructor() {
    super();
  }

  private tick = TimeSinceComponent.tick$.pipe(takeUntilDestroyed());
  private lastChange = DateTime.now();

  public ngOnInit(): void {
    // because we are using takeUntilDestroyed, we don't need a takeUntil
    // this is because all the functionality is handled by takeUntilDestroyed
    // eslint-disable-next-line rxjs-angular/prefer-takeuntil
    this.tick.subscribe(() => {
      const valueDelta = this.value.diffNow();
      const lastChangeDelta = this.lastChange.diffNow();

      // we want to update the "time since" every second if the time is less than a minute
      // if the time since is greater than a minute, we want to update the value every minute
      // because the observable will trigger every second, using elapsedTime.seconds < 1
      // will cause the value to update roughly every minute
      if (
        Math.abs(valueDelta.as("seconds")) <= 60 ||
        Math.abs(lastChangeDelta.as("seconds")) >= 60
      ) {
        this.update();
      }
    });
  }

  public update(): void {
    const tooltipDate = this.value.toFormat(
      AbstractTemplateComponent.TOOLTIP_DATETIME
    );
    const tooltipZone = AbstractDatetimeComponent.formatTimezone(
      this.value.zone,
      this.value
    );

    const durationSince = this.value.diffNow().rescale();

    this.tooltipText = `${tooltipDate} ${tooltipZone}`;
    this.isoDateTime = durationSince.toISO();
    this.documentText = toRelative(durationSince, {
      largest: 2,
      round: true,
    });

    // if the duration is positive, it implies that the date/time is in the future
    // therefore, we want to change the suffix from "ago" to "from now"
    if (durationSince.valueOf() > 0) {
      this.suffix = "from now";
    } else {
      this.suffix = "ago";
    }

    this.lastChange = DateTime.now();
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

  public static readonly tick$ = interval(1000);
}
