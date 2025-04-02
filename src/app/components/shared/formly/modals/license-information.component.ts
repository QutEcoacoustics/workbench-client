import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { ModalComponent } from "@menu/widget.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { SpdxLicense } from "@services/licenses/licenses.service";

@Component({
  selector: "baw-license-information-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title fw-bold">{{ license()?.name }}</h4>
    </div>

    <div class="modal-body modal-large">
      <div class="license-content bg-light rounded p-4" [innerText]="license()?.licenseText">
        @for (line of licenseContent(); track line) {
        <p>{{ line }}</p>
        }
      </div>

      <div>
        <a
          class="license-url"
          [href]="license()?.url"
          target="_blank"
          rel="noopener noreferrer"
        >
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
  public license = input<SpdxLicense | undefined>();

  protected licenseContent = computed(() => {
    if (!this.license()) {
      return [];
    }

    return this.license()
      .licenseText.split("\n")
      .map((line) => line.trim());
  });

  public closeModal(): void {
    this.modal().close();
  }
}
