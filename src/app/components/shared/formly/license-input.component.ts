import {
  AfterViewInit,
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
          @for (license of licenseOptions; track license) {
          <option [value]="license[0]">
            {{ license[1].name }}
          </option>
          }
        </select>

        @if (selectedLicense) {
        <button
          type="button"
          class="btn btn-secondary"
          (click)="openLicenseInformation()"
        >
          Show
        </button>

        }
      </div>
    </div>

    <ng-template #licenseInformationModal let-licenseModal>
      <baw-license-information-modal
        [modal]="licenseModal"
        [license]="currentLicense(selectedLicense)"
      >
        {{ currentLicense(selectedLicense)?.licenseText }}
      </baw-license-information-modal>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseInputComponent extends FieldType implements AfterViewInit {
  public constructor(private modals: NgbModal) {
    super();
  }

  public ngAfterViewInit(): void {
    this.selectedLicense = this.formControl.value;
  }

  @ViewChild("licenseInformationModal")
  private licenseInformationModal: ElementRef<HTMLElement>;

  @ViewChild("licenseInput")
  public licenseInput: ElementRef<HTMLSelectElement>;

  public asFormControl = asFormControl;
  protected selectedLicense: string;

  protected licenseOptions = Object.entries(spdxLicenseList);

  protected updateSelectedLicense(value: string): void {
    this.selectedLicense = value;
  }

  protected openLicenseInformation(): void {
    this.modals.open(this.licenseInformationModal, { size: "xl" });
  }

  protected currentLicense(license: string): (typeof spdxLicenseList)[0] {
    return license ? spdxLicenseList[license] : null;
  }
}
