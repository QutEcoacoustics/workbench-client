import { NgClass, NgTemplateOutlet } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef, inject } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toasts/toasts.service";

@Component({
  selector: "baw-toast-provider",
  templateUrl: "./toast-provider.component.html",
  styleUrl: "./toast-provider.component.scss",
  imports: [NgbToast, FontAwesomeModule, NgClass, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastProviderComponent {
  protected readonly toastService = inject(ToastService);

  protected isTemplateRef(value: unknown): value is TemplateRef<unknown> {
    return value instanceof TemplateRef;
  }
}
