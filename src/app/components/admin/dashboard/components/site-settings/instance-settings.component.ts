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
import { BatchAnalysisRemoteEnqueueLimit } from "@models/BatchAnalysisRemoteEnqueueLimit";
import { RangeComponent } from "@shared/input/range/range.component";
import { takeUntil } from "rxjs";

@Component({
  selector: "baw-instance-settings",
  templateUrl: "./instance-settings.component.html",
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

  protected enqueueLimit = signal<BatchAnalysisRemoteEnqueueLimit | null>(null);
  private enqueueLimitInput = viewChild<RangeComponent>("enqueueLimitInput");

  public ngOnInit(): void {
    // We use a "list" request here so that if this page is expanded to include
    // multiple settings, we only have to make one request and then parse out
    // the individual settings.
    this.siteSettings
      .show("batch_analysis_remote_enqueue_limit")
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((initialValue: BatchAnalysisRemoteEnqueueLimit) => {
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

    const newModel = new BatchAnalysisRemoteEnqueueLimit({
      ...this.enqueueLimit(),
      value,
    });

    this.siteSettings.update(newModel);
  }
}
