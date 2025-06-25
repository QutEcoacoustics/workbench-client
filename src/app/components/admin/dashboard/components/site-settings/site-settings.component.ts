import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SiteSettingsService } from "@baw-api/site-settings/site-settings.service";
import { DebouncedInputDirective } from "@directives/debouncedInput/debounced-input.directive";
import { toNumber } from "@helpers/typing/toNumber";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { SiteSetting } from "@models/SiteSetting";
import { ToastService } from "@services/toasts/toasts.service";
import { RangeComponent } from "@shared/input/range/range.component";
import { takeUntil } from "rxjs";

@Component({
  selector: "baw-site-settings",
  templateUrl: "./site-settings.component.html",
  styleUrl: "./site-settings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DebouncedInputDirective, RangeComponent, FormsModule],
})
export class SiteSettingsComponent extends withUnsubscribe() implements OnInit {
  public constructor(
    private siteSettings: SiteSettingsService,
    private notifications: ToastService,
  ) {
    super();
  }

  protected enqueueLimit = signal<SiteSetting | null>(null);
  private enqueueLimitInput = viewChild<RangeComponent>("enqueueLimitInput");

  public ngOnInit(): void {
    // We use a "list" request here so that if this page is expanded to include
    // multiple settings, we only have to make one request and then parse out
    // the individual settings.
    this.siteSettings
      .show("batch_analysis_remote_enqueue_limit")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((initialValue: SiteSetting) => {
        this.enqueueLimit.set(initialValue);
        this.enqueueLimitInput().value.set(initialValue.value);
      });
  }

  protected updateEnqueueLimit(stringValue: string) {
    const value = toNumber(stringValue);
    if (value === null) {
      console.error("Failed to updated enqueue limit");
      return;
    }

    const newModel = new SiteSetting({
      name: "batch_analysis_remote_enqueue_limit",
      value,
    });

    this.siteSettings
      .update(newModel)
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
