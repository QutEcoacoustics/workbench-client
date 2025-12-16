import { ChangeDetectionStrategy, Component } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { Settings, SystemZone, Zone } from "luxon";
import { AbstractDatetimeComponent } from "../abstract-datetime.component";

/**
 * Displays a datetime (possibly from another timezone) in the users locale and timezone
 * Commonly used for displaying instants (real dates that happened in no particular timezone)
 * e.g. timestamps like `createdAt` and `updatedAt`.
 *
 * This component always shows a date in the user's local timezone.
 */
@Component({
  selector: "baw-datetime",
  templateUrl: "../../abstract-template.component.html",
  imports: [NgbTooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatetimeComponent extends AbstractDatetimeComponent {
  //! Warning: This method will break if we ever change the default timezone
  // which we should have no reason to do outside of tests
  public override extractTimezone(): Zone {
    if (Settings.defaultZone !== SystemZone.instance) {
      console.warn("DefaultZone has lost parity with SystemZone");
    }

    return Settings.defaultZone;
  }
}
