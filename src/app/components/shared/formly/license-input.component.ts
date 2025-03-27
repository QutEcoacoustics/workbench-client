import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import spdxLicenseList from "spdx-license-list/full";
import { asFormControl } from "./helper";

@Component({
  selector: "baw-license-input",
  template: `
    <div class="form-group mb-3">
      <label *ngIf="props.label" [for]="field.id">
        {{ props.label + (props.required ? " *" : "") }}
      </label>

      <div class="form-control input-group p-0">
        <select
          #licenseInput
          class="form-select"
          [formControl]="asFormControl(formControl)"
          [formlyAttributes]="field"
          (ngModelChange)="updateSelectedLicense($event)"
        >
          <option
            *ngFor="let license of licenseOptions"
            [ngValue]="license"
            [value]="license.name"
          >
            {{ license.name }}
          </option>
        </select>

        <button
          type="button"
          class="btn btn-secondary"
          (click)="openLicenseInformation()"
        >
          Show
        </button>
      </div>
    </div>

    <p class="alert alert-warning">
      <strong>Warning:</strong> This is not legal advice. Please consult a legal
      professional for advice on licensing.
    </p>

    <ng-template #licenseInformationModal let-licenseModal>
      <baw-license-information-modal
        [modal]="licenseModal"
        [license]="selectedLicense"
      >
        {{ selectedLicense?.licenseText }}
      </baw-license-information-modal>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseInputComponent extends FieldType {
  public constructor(private modals: NgbModal) {
    super();
  }

  @ViewChild("licenseInformationModal")
  private licenseInformationModal: ElementRef<HTMLElement>;

  @ViewChild("licenseInput")
  public licenseInput: ElementRef<HTMLSelectElement>;

  public asFormControl = asFormControl;
  protected selectedLicense: (typeof spdxLicenseList)[0];

  protected licenseOptions = Object.entries(spdxLicenseList).flatMap(
    ([_key, value]) => {
      return [value];
    }
  );

  protected updateSelectedLicense(value: (typeof spdxLicenseList)[0]): void {
    this.selectedLicense = value;
  }

  protected openLicenseInformation(): void {
    this.modals.open(this.licenseInformationModal, { size: "xl" });
  }
}
