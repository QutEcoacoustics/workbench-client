import { ChangeDetectionStrategy, Component, Input, input, model, signal } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "@menu/widget.component";
import { VerificationParameters } from "../../verification-form/verificationParameters";
import { VerificationFormComponent } from "../../verification-form/verification-form.component";

@Component({
  selector: "baw-verification-filters-modal",
  templateUrl: "./verification-filters.component.html",
  imports: [VerificationFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationFiltersModalComponent implements ModalComponent {
  public readonly formValue = model.required<VerificationParameters>();
  public readonly modal = input<NgbActiveModal>();

  // TODO: Migrate this to a signal once we add support for signals to the
  // ModalComponent interface.
  @Input()
  public successCallback: (newModel: VerificationParameters) => void;

  protected readonly isFormDirty = signal(true);

  public closeModal(): void {
    this.modal().close();
  }

  public success(): void {
    if (this.isFormDirty()) {
      this.successCallback(this.formValue());

      this.closeModal();
      return;
    }

    this.closeModal();
  }
}
