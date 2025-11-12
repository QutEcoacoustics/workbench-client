import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import {
  BootstrapColorTypes,
  BootstrapScreenSizes,
} from "@helpers/bootstrapTypes";

/**
 * Loading Animation
 */
@Component({
  selector: "baw-loading",
  templateUrl: "./loading.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  public readonly color = input<BootstrapColorTypes>("info");
  public readonly size = input<BootstrapScreenSizes>("md");
  public readonly type = input<"border" | "grower">("border");

  protected readonly spinnerClass = computed(() => {
    return {
      [`spinner-${this.type()}`]: true,
      [`spinner-${this.type()}-${this.size()}`]: true,
      [`text-${this.color()}`]: true,
    };
  });
}
