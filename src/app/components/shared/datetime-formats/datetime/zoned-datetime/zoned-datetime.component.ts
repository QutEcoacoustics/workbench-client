import { Component, Input } from "@angular/core";
import { FixedOffsetZone, IANAZone, Zone } from "luxon";
import { TimezoneInformation } from "@interfaces/apiInterfaces";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { isInstantiated } from "@helpers/isInstantiated/isInstantiated";
import { AbstractDatetimeComponent } from "../abstract-datetime.component";

type BawTimezoneUnion = Zone | TimezoneInformation | string;

@Component({
  selector: "baw-zoned-datetime",
  templateUrl: "../../abstract-template.component.html",
  styleUrls: ["zoned-datetime.component.scss"],
  standalone: true,
  imports: [NgbTooltipModule],
})
export class ZonedDateTimeComponent extends AbstractDatetimeComponent {
  public constructor() {
    super();
  }

  // if we set the timezone to null or undefined, we want to remove the explicit timezone
  // which will result in any implicit time zone taking effect
  @Input()
  public set timezone(inputValue: BawTimezoneUnion) {
    if (isInstantiated(inputValue)) {
      const timezoneIdentifier = inputValue?.["identifier"] ?? inputValue;
      this._timezone = this.normalizeTimezone(timezoneIdentifier);
    } else {
      this._timezone = null;
    }
  }

  public get timezone(): Zone {
    return this._timezone;
  }

  private _timezone: Zone;

  public override extractTimezone(): Zone {
    return this.timezone ? this.timezone : this.value.zone;
  }

  private normalizeTimezone(timezoneIdentifier: Zone | string): Zone | FixedOffsetZone {
    if (typeof timezoneIdentifier === "string") {
      const zone = IANAZone.create(timezoneIdentifier);

      // the IANA zone will be invalid if we pass in an offset and not an IANA zone
      // eg. "UTC+10:00" is invalid
      if (!zone.isValid) {
        if (!timezoneIdentifier.startsWith("UTC")) {
          timezoneIdentifier = `UTC${timezoneIdentifier}`;
        }

        const utcOffsetZone = FixedOffsetZone.parseSpecifier(timezoneIdentifier);

        if (utcOffsetZone?.isValid) {
          return utcOffsetZone;
        } else {
          console.error("baw-zoned-datetime: invalid timezone provided");
          return FixedOffsetZone.utcInstance;
        }
      }

      return zone;
    }

    return timezoneIdentifier;
  }
}
