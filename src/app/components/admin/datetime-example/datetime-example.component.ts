import { Component } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "@helpers/page/pageComponent";
import { DateTime, Duration } from "luxon";
import { FormsModule } from "@angular/forms";
import { adminCategory, adminDateTimeTemplateMenuItem } from "../admin.menus";
import { adminMenuItemActions } from "../dashboard/dashboard.component";
import { DatetimeComponent } from "../../shared/datetime-formats/datetime/datetime/datetime.component";
import { ZonedDateTimeComponent } from "../../shared/datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { DurationComponent } from "../../shared/datetime-formats/duration/duration.component";
import { TimeSinceComponent } from "../../shared/datetime-formats/time-since/time-since.component";

@Component({
  selector: "baw-admin-datetime-templates",
  templateUrl: "datetime-example.component.html",
  imports: [
    FormsModule,
    DatetimeComponent,
    ZonedDateTimeComponent,
    DurationComponent,
    TimeSinceComponent,
  ],
})
class DateTimeExampleComponent extends PageComponent {
  public constructor() {
    super();
  }

  protected fakeImplicitTimezone = "Australia/Perth";
  protected fakeSiteTimezone = "Australia/Perth";
  protected fakeDuration = Duration.fromObject({ hours: 1, minutes: 30 });
  protected fakeDate = DateTime.now().setZone(this.fakeImplicitTimezone, {
    keepLocalTime: true,
  });
  private dateTimeFormat = "yyyy-MM-dd HH:mm:ss.SSS";

  protected updateFakeDuration(event): void {
    const inputValue: string = event.target.value;
    const newDuration = Duration.fromISO(inputValue);

    if (newDuration.isValid) {
      this.fakeDuration = newDuration;
    }
  }

  protected updateFakeDate(event): void {
    const inputValue: string = event.target.value;
    let newDate = DateTime.fromFormat(inputValue, this.dateTimeFormat);

    newDate = newDate.setZone(this.fakeImplicitTimezone, {
      keepLocalTime: true,
    });

    if (newDate.isValid) {
      this.fakeDate = newDate;
    }
  }

  protected updateFakeImplicitTimezone(event): void {
    this.fakeImplicitTimezone = event.target.value;

    const newFakeDate = this.fakeDate.setZone(this.fakeImplicitTimezone, {
      keepLocalTime: true,
    });

    if (newFakeDate.isValid) {
      this.fakeDate = newFakeDate;
    }
  }

  // used in the date/time input
  protected formatDate(dateTime: DateTime): string {
    return dateTime.toFormat(this.dateTimeFormat);
  }
}

DateTimeExampleComponent.linkToRoute({
  category: adminCategory,
  pageRoute: adminDateTimeTemplateMenuItem,
  menus: { actions: List(adminMenuItemActions) },
});

export { DateTimeExampleComponent };
