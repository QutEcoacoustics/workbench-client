import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { License } from "@models/data/License";
import { NgbHighlight, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FieldType } from "@ngx-formly/core";
import {
  LicensesService,
  SpdxLicense,
} from "@services/licenses/licenses.service";
import {
  TypeaheadInputComponent,
  TypeaheadSearchCallback,
} from "@shared/typeahead-input/typeahead-input.component";
import { asFormControl } from "../helper";
import { LicenseInformationModalComponent } from "../modals/license-information.component";

type LicenseMap = Record<string, SpdxLicense>;

/**
 * @description
 * An ngx-formly component that provides a license input field.
 */
@Component({
  selector: "baw-license-input",
  templateUrl: "./license-input.component.html",
  styleUrl: "./license-input.component.scss",
  imports: [
    TypeaheadInputComponent,
    LicenseInformationModalComponent,
    NgbHighlight,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LicenseInputComponent
  extends FieldType
  implements OnInit, AfterViewInit
{
  private readonly modals = inject(NgbModal);
  private readonly licenses = inject(LicensesService);

  private readonly licenseInformationModal =
    viewChild<ElementRef<HTMLElement>>("licenseInformationModal");
  private readonly licenseTypeahead =
    viewChild<TypeaheadInputComponent>("licenseTypeahead");

  public readonly asFormControl = asFormControl;
  protected readonly selectedLicense = signal<License | null>(null);
  protected readonly availableLicenses = signal<LicenseMap>({});
  protected readonly searchCallback =
    signal<TypeaheadSearchCallback<SpdxLicense>>(null);

  public async ngOnInit() {
    const licenses = await this.licenses.availableLicenses();
    this.availableLicenses.set(licenses);

    const initialValue = this.formControl.value;
    if (initialValue in this.availableLicenses()) {
      this.selectedLicense.set(
        new License({
          identifier: initialValue,
          ...this.availableLicenses()[initialValue],
        }),
      );
    }

    const searchCallback = await this.licenses.typeaheadCallback();
    this.searchCallback.set(searchCallback);
  }

  public ngAfterViewInit(): void {
    this.licenseTypeahead().inputModel.set(this.formControl.value);
  }

  protected updateSelectedLicense(value: Readonly<any[]>): void {
    if (value.length === 0) {
      this.selectedLicense.set(null);
      return;
    }

    this.selectedLicense.set(value[0]);

    // This is a hack to get around the fact that the typeahead input is not
    // a component that can be used as a form control.
    // TODO: If we get time, we should make the typeahead input a form control
    // and doubly bind the value to this components form control.
    this.formControl.setValue(this.selectedLicense().identifier);
  }

  protected removeLicense(): void {
    this.selectedLicense.set(null);
    this.formControl.setValue(null);
    this.licenseTypeahead().inputModel.set(null);
  }

  protected openLicenseInformation(): void {
    this.modals.open(this.licenseInformationModal(), { size: "xl" });
  }
}
