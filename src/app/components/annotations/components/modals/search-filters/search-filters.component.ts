import { Component, Input } from "@angular/core";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { ModalComponent } from "@menu/widget.component";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchFormComponent } from "../../annotation-search-form/annotation-search-form.component";

@Component({
  selector: "baw-search-filters-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Change Search Filters</h4>
    </div>

    <div class="filters-modal-body modal-body modal-large">
      <baw-annotation-search-form
        [(searchParameters)]="formValue"
      ></baw-annotation-search-form>
    </div>

    <div class="modal-footer justify-content-end">
      <div class="mt-2">
        <button
          id="exit-btn"
          class="btn btn-outline-primary me-2"
          (click)="closeModal()"
          [disabled]="!this.isFormDirty"
        >
          Exit without updating
        </button>
        <button
          id="update-filters-btn"
          class="btn btn-primary"
          (click)="success()"
        >
          Update search filters
        </button>
      </div>
    </div>
  `,
  imports: [AnnotationSearchFormComponent],
})
export class SearchFiltersModalComponent implements ModalComponent {
  @Input() public modal: NgbActiveModal;
  @Input() public formValue: AnnotationSearchParameters;
  @Input() public successCallback: (
    newModel: AnnotationSearchParameters,
  ) => void;

  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;
  @Input() public hasDecisions: boolean;

  protected isFormDirty = true;

  protected get isDirty(): boolean {
    return this.isFormDirty && this.hasDecisions;
  }

  public closeModal(): void {
    this.modal.close();
  }

  public success(): void {
    if (this.isFormDirty) {
      this.successCallback(this.formValue);
      this.closeModal();
      return;
    }

    this.closeModal();
  }
}
