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
  templateUrl: "./license-information.component.html",
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

    return this.license().licenseText.split("\n");
  });

  public closeModal(): void {
    this.modal().close();
  }
}
