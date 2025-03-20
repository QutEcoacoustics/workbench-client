import { Component } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { ToastsService } from "@services/toasts/toasts.service";

@Component({
  selector: "baw-toast-provider",
  templateUrl: "toast-provider.component.html",
  styleUrl: "toast-provider.component.scss",
  // standalone: true,
  // imports: [NgbToast],
  // viewProviders: [ToastsService],
})
export class ToastProviderComponent {
  public constructor(
    protected toastService: ToastsService,
    private sanitizer: DomSanitizer,
  ) {}

  protected toastItems = this.toastService.toasts();

  protected domTemplate(value: string) {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
