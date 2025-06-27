import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
} from "@angular/core";
import { FieldType } from "@ngx-formly/core";
import { NgbHighlight, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {
  LicensesService,
  SpdxLicense,
} from "@services/licenses/licenses.service";
import { of } from "rxjs";
import {
  TypeaheadInputComponent,
  TypeaheadSearchCallback,
} from "@shared/typeahead-input/typeahead-input.component";
import { License } from "@models/data/License";
import { asFormControl } from "../helper";
import { LicenseInformationModalComponent } from "../modals/license-information.component";

/**
 * @description
 * An ngx-formly component that provides a license input field.
 */
@Component({
  selector: "baw-license-input",
  templateUrl: "license-input.component.html",
  styleUrl: "./license-input.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TypeaheadInputComponent,
    LicenseInformationModalComponent,
    NgbHighlight,
  ],
})
export class LicenseInputComponent
  extends FieldType
  implements OnInit, AfterViewInit
{
  public constructor(
    private modals: NgbModal,
    private licenses: LicensesService,
  ) {
    super();
  }

  @ViewChild("licenseInformationModal")
  private licenseInformationModal: ElementRef<HTMLElement>;

  @ViewChild("licenseTypeahead")
  private licenseTypeahead: TypeaheadInputComponent;

  public asFormControl = asFormControl;
  protected selectedLicense: License | null = null;
  protected availableLicenses = signal<Record<string, SpdxLicense>>({});
  protected searchCallback = signal<TypeaheadSearchCallback<SpdxLicense>>(() =>
    of([]),
  );

  public async ngOnInit() {
    const licenses = await this.licenses.availableLicenses();
    this.availableLicenses.set(licenses);

    const initialValue = this.formControl.value;
    if (initialValue in this.availableLicenses()) {
      this.selectedLicense = new License({
        identifier: initialValue,
        ...this.availableLicenses()[initialValue],
      });
    }

    const searchCallback = await this.licenses.typeaheadCallback();
    this.searchCallback.set(searchCallback);
  }

  public ngAfterViewInit(): void {
    this.licenseTypeahead.inputModel = this.formControl.value;
  }

  protected updateSelectedLicense(value: Readonly<any[]>): void {
    if (value.length === 0) {
      this.selectedLicense = null;
      return;
    }

    this.selectedLicense = value[0];

    // This is a hack to get around the fact that the typeahead input is not
    // a component that can be used as a form control.
    // TODO: If we get time, we should make the typeahead input a form control
    // and doubly bind the value to this components form control.
    this.formControl.setValue(this.selectedLicense.identifier);
  }

  protected removeLicense(): void {
    this.selectedLicense = null;
    this.formControl.setValue(null);
    this.licenseTypeahead.inputModel = null;
  }

  protected openLicenseInformation(): void {
    this.modals.open(this.licenseInformationModal, { size: "xl" });
  }
}
