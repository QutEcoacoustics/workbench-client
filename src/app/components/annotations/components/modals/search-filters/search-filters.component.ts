import { Component, Input, input, model } from "@angular/core";
import { ModalComponent } from "@menu/widget.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchFormComponent } from "../../annotation-search-form/annotation-search-form.component";
import { AnnotationSearchParameters } from "../../annotation-search-form/annotationSearchParameters";

@Component({
  selector: "baw-search-filters-modal",
  templateUrl: "./search-filters.component.html",
  imports: [AnnotationSearchFormComponent],
})
export class SearchFiltersModalComponent implements ModalComponent {
  public readonly formValue = model.required<AnnotationSearchParameters>();
  public readonly modal = input<NgbActiveModal>();

  // TODO: Migrate this to a signal once we add support for signals to the
  // ModalComponent interface.
  @Input()
  public successCallback: (newModel: AnnotationSearchParameters) => void;

  public closeModal(): void {
    this.modal().close();
  }

  public success(): void {
    this.successCallback(this.formValue());
    this.closeModal();
  }
}
