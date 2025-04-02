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
import { createItemSearchCallback } from "@shared/typeahead-input/typeahead-callbacks";
import { of } from "rxjs";
import { TypeaheadSearchCallback } from "@shared/typeahead-input/typeahead-input.component";
import { asFormControl } from "../helper";

/**
 * @description
 * An ngx-formly component that provides a license input field.
 */
@Component({
  selector: "baw-license-input",
  templateUrl: "license-input.component.html",
  styleUrl: "license-input.component.scss",
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
  protected searchCallback = signal<TypeaheadSearchCallback<SpdxLicense>>(() => of([]));

  public async ngOnInit() {
    const licenses = await this.licenses.availableLicenses();
    this.availableLicenses.set(licenses);

    const initialValue = this.formControl.value;
    if (initialValue in this.availableLicenses()) {
      this.selectedLicense = this.availableLicenses()[initialValue];
    }

    const suggestedLicenses = await this.licenses.suggestedLicenses();
    this.searchCallback.set(createItemSearchCallback(suggestedLicenses));
  }

  protected updateSelectedLicense(value: Readonly<SpdxLicense[]>): void {
    if (value.length === 0) {
      this.selectedLicense = null;
      return;
    }

    this.selectedLicense = value[0];
  }

  protected removeLicense(): void {
    this.formControl.setValue(null);
  }

  protected openLicenseInformation(): void {
    this.modals.open(this.licenseInformationModal, { size: "xl" });
  }
}
