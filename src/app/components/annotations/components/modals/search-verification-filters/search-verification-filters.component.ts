import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
  model,
} from "@angular/core";
import { ModalComponent } from "@menu/widget.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchFormComponent } from "../../annotation-search-form/annotation-search-form.component";
import { AnnotationSearchParameters } from "../../annotation-search-form/annotationSearchParameters";
import { VerificationFormComponent } from "../../verification-form/verification-form.component";
import { VerificationParameters } from "../../verification-form/verificationParameters";

interface ModalReturnValue {
  searchParameters: AnnotationSearchParameters;
  verificationParameters: VerificationParameters;
}

@Component({
  selector: "baw-search-verification-filters-modal",
  templateUrl: "./search-verification-filters.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AnnotationSearchFormComponent, VerificationFormComponent],
})
export class SearchVerificationFiltersModalComponent implements ModalComponent {
  public readonly searchFormValue =
    model.required<AnnotationSearchParameters>();
  public readonly verificationFormValue =
    model.required<VerificationParameters>();

  public readonly modal = input<NgbActiveModal>();

  // TODO: Migrate this to a signal once we add support for signals to the
  // ModalComponent interface.
  @Input()
  public successCallback: (newModel: ModalReturnValue) => void;

  public closeModal(): void {
    this.modal().close();
  }

  public success(): void {
    this.successCallback({
      searchParameters: this.searchFormValue(),
      verificationParameters: this.verificationFormValue(),
    });

    this.closeModal();
  }
}
