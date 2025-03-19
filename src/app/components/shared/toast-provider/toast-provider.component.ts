import { Component } from "@angular/core";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { ToastsService } from "@services/toasts/toasts.service";

@Component({
  selector: "baw-toast-provider",
  templateUrl: "./toast-provider.component.html",
  styleUrl: "./toast-provider.component.scss",
  standalone: true,
  imports: [NgbToast],
  viewProviders: [ToastsService],
})
export class ToastProviderComponent {
  public constructor(public toastService: ToastsService) {}
}
