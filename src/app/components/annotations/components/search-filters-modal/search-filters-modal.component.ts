import { Component, Input } from "@angular/core";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { ModalComponent } from "@menu/widget.component";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-search-filters-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Change Search Filters</h4>
    </div>

    <div class="modal-body modal-large">
      <baw-annotation-search-form
        [(searchParameters)]="formValue"
        [project]="project"
        [region]="region"
        [site]="site"
      ></baw-annotation-search-form>
    </div>

    <div class="modal-footer justify-content-start">
      <div>
        @if (dirty) {
        <p>
          <strong>
            You have unapplied search filters. If you update the verification
            grid, your progress will be lost.
          </strong>
        </p>
        }

        <div class="mt-2">
          <button
            class="btn btn-outline-primary me-2"
            (click)="closeModal()"
            [disabled]="!this.dirty"
          >
            Undo Changes
          </button>
          <button
            class="btn btn-warning"
            (click)="success()"
            [ngClass]="{
              'btn-primary': !dirty,
              'btn-warning': dirty
            }"
          >
            Update Search Filters
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SearchFiltersModalComponent implements ModalComponent {
  @Input() public modal: NgbActiveModal;
  @Input() public formValue: AnnotationSearchParameters;
  @Input() public successCallback: (newModel: AnnotationSearchParameters) => void;

  @Input() public project: Project;
  @Input() public region: Region;
  @Input() public site: Site;

  protected dirty = true;

  public closeModal(): void {
    this.modal.close();
  }

  public success(): void {
    if (this.dirty) {
      this.successCallback(this.formValue);
      this.closeModal();
      return;
    }

    this.closeModal();
  }
}
