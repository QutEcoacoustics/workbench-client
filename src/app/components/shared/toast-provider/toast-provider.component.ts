import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, TemplateRef } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { ToastService } from "@services/toasts/toasts.service";

@Component({
  selector: "baw-toast-provider",
  templateUrl: "toast-provider.component.html",
  styleUrl: "toast-provider.component.scss",
  standalone: true,
  imports: [NgbToast, FontAwesomeModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastProviderComponent {
  public constructor(
    protected toastService: ToastService,
    private sanitizer: DomSanitizer,
  ) {}

  protected domTemplate(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

  protected isTemplateRef(value: unknown): value is TemplateRef<unknown> {
    return value instanceof TemplateRef;
  }
}
