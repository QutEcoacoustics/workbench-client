import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SiteSettingsService } from "@baw-api/site-settings/site-settings.service";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { SortFunction } from "@helpers/advancedTypes";
import { toNumber } from "@helpers/typing/toNumber";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { SiteSetting } from "@models/SiteSetting";
import { ToastService } from "@services/toasts/toasts.service";
import { RangeComponent } from "@shared/input/range/range.component";
import { iif, map, takeUntil } from "rxjs";

@Component({
  selector: "baw-site-settings",
  templateUrl: "./site-settings.component.html",
  styleUrl: "./site-settings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DebouncedInputDirective, RangeComponent, FormsModule],
})
export class SiteSettingsComponent extends withUnsubscribe() implements OnInit {
  private readonly api = inject(SiteSettingsService);
  private readonly notifications = inject(ToastService);

  protected readonly settings = signal<SiteSetting[]>([]);

  // A sort function that can be used to sort site settings by name
  private settingsSorter: SortFunction<SiteSetting> = (a, b) =>
    a.name.localeCompare(b.name) as ReturnType<SortFunction<SiteSetting>>;

  public ngOnInit() {
    this.updateValues();
  }

  protected updateSetting(model: SiteSetting, emittedValue: string | null) {
    const value =
      typeof emittedValue === "string" ? toNumber(emittedValue) : emittedValue;

    const isUnsetRequest = value === null;
    iif(
      () => isUnsetRequest,
      this.api.destroy(model),
      this.api.update(new SiteSetting({ ...model, value })),
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          const message = isUnsetRequest
            ? `Successfully unset ${model.name}`
            : `Successfully updated ${model.name} to ${value}`;

          this.notifications.success(message);

          // Because the destroy response does not return the updated model.
          this.updateValues();
        },
        error: () => {
          this.notifications.error(`Failed to update ${model.name}`);
        },
      });
  }

  private updateValues() {
    // We use a "list" request here so that if this page is expanded to include
    // multiple settings, we only have to make one request and then parse out
    // the individual settings.
    this.api
      .list()
      .pipe(
        // We sort settings by name so that the UI structure is stable and does
        // not rely on the order returned by the API
        map((results) => results.sort(this.settingsSorter)),
        takeUntil(this.unsubscribe),
      )
      .subscribe((initialValues: SiteSetting[]) => {
        this.settings.set(initialValues);
      });
  }
}
