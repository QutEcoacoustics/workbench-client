import { Component } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "@helpers/page/pageComponent";
import { DateTime, Duration } from "luxon";
import { adminCategory, adminDateTimeTemplateMenuItem } from "../admin.menus";
import { adminMenuItemActions } from "../dashboard/dashboard.component";

@Component({
  selector: "baw-admin-datetime-templates",
  templateUrl: "datetime-example.component.html",
})
class DateTimeExampleComponent extends PageComponent {
  public constructor() {
    super();
  }

  protected fakeImplicitTimezone = "Australia/Perth";
  protected fakeSiteTimezone = "Australia/Perth";
  protected fakeDuration = Duration.fromObject({ hours: 1, minutes: 30 });
  private dateTimeFormat = "yyyy-MM-dd HH:mm:ss.SSS";
  private _fakeDate = DateTime.now();

  // we use a getter for the fakeDate so that when either the implicit timezone or
  // _fakeDate is updated, the document updates accordingly
  protected get fakeDate(): DateTime {
    return this._fakeDate.setZone(this.fakeImplicitTimezone, {
      keepLocalTime: true,
    }) as any;
  }

  protected updateFakeDuration(event): void {
    const inputValue: string = event.target.value;
    const newDuration = Duration.fromISO(inputValue);

    if (newDuration.isValid) {
      this.fakeDuration = newDuration;
    }
  }

  protected updateFakeDate(event): void {
    const inputValue: string = event.target.value;
    const newDate = DateTime.fromFormat(inputValue, this.dateTimeFormat);

    if (newDate.isValid) {
      this._fakeDate = newDate;
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
