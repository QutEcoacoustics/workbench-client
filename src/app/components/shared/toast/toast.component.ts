import { ChangeDetectionStrategy, Component, computed, ContentChild, input, TemplateRef } from "@angular/core";
import { ToastInfo, ToastOptions, ToastService, ToastVariant } from "@services/toasts/toasts.service";

/**
 * @description
 * Creates a temptable ToastInfo model which can be passed to the notification
 * service or opened/closed through the open/close methods.
 *
 * This component provides an ergonomic way to create toast notifications
 * with templated content.
 */
@Component({
  selector: "baw-toast",
  template: "<ng-content></ng-content>",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent {
  public constructor(private toastService: ToastService) {}

  public variant = input<ToastVariant>("default");
  public title = input<string>("");
  public options = input<ToastOptions>({});

  @ContentChild(TemplateRef)
  private content!: TemplateRef<unknown>;

  private toastInfo = computed<ToastInfo>(() => {
    return {
      title: this.title(),
      message: this.content,
      variant: this.variant(),
      options: this.options(),
    };
  });

  public open() {
    this.toastService.showToastInfo(this.toastInfo());
  }

  public close() {
    this.toastService.remove(this.toastInfo());
  }
}
