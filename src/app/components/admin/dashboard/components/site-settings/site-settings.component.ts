import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SiteSettingsService } from "@baw-api/site-settings/site-settings.service";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { SortFunction } from "@helpers/advancedTypes";
import { toNumber } from "@helpers/typing/toNumber";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { SiteSetting } from "@models/SiteSetting";
import { ToastService } from "@services/toasts/toasts.service";
import { RangeComponent } from "@shared/input/range/range.component";
import { map, takeUntil } from "rxjs";

@Component({
  selector: "baw-site-settings",
  templateUrl: "./site-settings.component.html",
  styleUrl: "./site-settings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DebouncedInputDirective, RangeComponent, FormsModule],
})
export class SiteSettingsComponent extends withUnsubscribe() implements OnInit {
  public constructor(
    private api: SiteSettingsService,
    private notifications: ToastService,
  ) {
    super();
  }

  protected settings = signal<SiteSetting[]>([]);

  // A sort function that can be used to sort site settings by name
  private settingsSorter: SortFunction<SiteSetting> = (a, b) => {
    const nameA = a.name;
    const nameB = b.name;

    if (nameA < nameB) {
      return -1;
    }

    if (nameA > nameB) {
      return 1;
    }

    return 0;
  }

  public ngOnInit(): void {
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

  protected updateSetting(model: SiteSetting, stringValue: string) {
    const value = toNumber(stringValue);
    if (value === null) {
      console.error(`Failed to updated ${model.name} limit`);
      return;
    }

    const updatedModelBody = new SiteSetting({ ...model, value });

    this.api
      .update(updatedModelBody)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe({
        next: () => {
          const message = `Successfully updated batch_analysis_remote_enqueue_limit to ${value}`;
          this.notifications.success(message);
        },
        error: () => {
          const message =
            "Failed to update batch_analysis_remote_enqueue_limit";
          this.notifications.error(message);
        },
      });
  }
}
