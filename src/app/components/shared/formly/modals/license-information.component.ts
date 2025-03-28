import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { ModalComponent } from "@menu/widget.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

export interface LicenseInformation {
  name: string;
  url: string;
}

@Component({
  selector: "baw-license-information-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title fw-bold">{{ license()?.name }}</h4>
    </div>

    <div class="modal-body modal-large">
      <p class="alert alert-warning">
        <strong>Warning:</strong> This is not legal advice. Please consult a
        legal professional for advice on licensing.
      </p>

      <pre class="license-content">
        <ng-content></ng-content>
      </pre>

      <div>
        <a class="license-url" [href]="license()?.url" target="_blank" rel="noopener noreferrer">
          {{ license()?.url }}
        </a>
      </div>
    </div>

    <div class="modal-footer justify-content-end">
      <button class="btn btn-outline-primary me-2" (click)="closeModal()">
        Close
      </button>
    </div>
  `,
  styleUrl: "license-information.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseInformationModalComponent implements ModalComponent {
  public modal = input<NgbActiveModal>();
  public license = input<LicenseInformation | undefined>();

  public closeModal(): void {
    this.modal().close();
  }
}
