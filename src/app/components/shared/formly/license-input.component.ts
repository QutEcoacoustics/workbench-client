import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  LicensesService,
  SpdxLicense,
} from "@services/licenses/licenses.service";
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
          class="form-select"
          [formControl]="asFormControl(formControl)"
          [formlyAttributes]="field"
          (ngModelChange)="updateSelectedLicense($event)"
        >
          @for (license of availableLicenses() | keyvalue; track license) {
          <option [value]="license.key">
            {{ license.value.name }}
          </option>
          }
        </select>

        @if (selectedLicense) {
        <button
          type="button"
          class="btn btn-outline-danger"
          (click)="removeLicense()"
        >
          Remove
        </button>

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
        [license]="selectedLicense"
      ></baw-license-information-modal>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseInputComponent extends FieldType implements OnInit {
  public constructor(
    private modals: NgbModal,
    private licenses: LicensesService
  ) {
    super();
  }

  @ViewChild("licenseInformationModal")
  private licenseInformationModal: ElementRef<HTMLElement>;

  public asFormControl = asFormControl;
  protected selectedLicense: SpdxLicense | null;
  protected availableLicenses = signal<Record<string, SpdxLicense>>({});

  public async ngOnInit() {
    const licenses = await this.licenses.availableLicenses();
    this.availableLicenses.set(licenses);

    const initialValue = this.formControl.value;
    if (initialValue in this.availableLicenses()) {
      this.selectedLicense = this.availableLicenses()[initialValue];
    }
  }

  protected updateSelectedLicense(value: string): void {
    if (value in this.availableLicenses()) {
      this.selectedLicense = this.availableLicenses()[value];
    } else {
      this.selectedLicense = null;
    }
  }

  protected removeLicense(): void {
    this.formControl.setValue(null);
  }

  protected openLicenseInformation(): void {
    this.modals.open(this.licenseInformationModal, { size: "xl" });
  }
}
