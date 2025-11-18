import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  model,
} from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalComponent } from "@menu/widget.component";
import { VerificationParameters } from "../../verification-form/verificationParameters";
import { VerificationFormComponent } from "../../verification-form/verification-form.component";
import { AnnotationSearchParameters } from "../../annotation-search-form/annotationSearchParameters";

@Component({
  selector: "baw-verification-filters-modal",
  templateUrl: "./verification-filters.component.html",
  imports: [VerificationFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationFiltersModalComponent implements ModalComponent {
  public readonly formValue = model.required<VerificationParameters>();
  public readonly searchParameters = input.required<AnnotationSearchParameters>();
  public readonly modal = input<NgbActiveModal>();

  // TODO: Migrate this to a signal once we add support for signals to the
  // ModalComponent interface.
  @Input()
  public successCallback: (newModel: VerificationParameters) => void;

  public closeModal(): void {
    this.modal().close();
  }

  public success(): void {
    this.successCallback(this.formValue());
    this.closeModal();
  }
}
