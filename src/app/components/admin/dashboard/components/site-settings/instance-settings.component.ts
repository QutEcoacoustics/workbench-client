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
import { RangeComponent } from "@shared/input/range/range.component";
import { firstValueFrom, takeUntil } from "rxjs";

@Component({
  selector: "baw-instance-settings",
  templateUrl: "./instance-settings.component.html",
  styleUrl: "./instance-settings.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DebouncedInputDirective, RangeComponent, FormsModule],
})
export class InstanceSettingsComponent
  extends withUnsubscribe()
  implements OnInit
{
  public constructor(private siteSettings: SiteSettingsService) {
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
      ...this.enqueueLimit(),
      value,
    });

    // We need this firstValueFrom so that the observable gets evaluated and the
    // requests is sent.
    // We do not do anything with the value and allow it to execute in async.
    firstValueFrom(this.siteSettings.update(newModel));
  }
}
