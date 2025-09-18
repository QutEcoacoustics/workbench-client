import { ChangeDetectionStrategy, Component, input, model } from "@angular/core";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFiltersModalComponent implements ModalComponent {
  public readonly modal = input.required<NgbActiveModal>();
  public readonly formValue = model<AnnotationSearchParameters>();
  public readonly successCallback = input.required<(newModel: AnnotationSearchParameters) => void>();

  public readonly project = input<Project>(undefined);
  public readonly region = input<Region>(undefined);
  public readonly site = input<Site>(undefined);
  public readonly hasDecisions = input<boolean>(undefined);

  protected isFormDirty = true;

  protected get isDirty(): boolean {
    return this.isFormDirty && this.hasDecisions();
  }

  public closeModal(): void {
    this.modal().close();
  }

  public success(): void {
    if (this.isFormDirty) {
      const callback = this.successCallback();
      callback(this.formValue());

      this.closeModal();
      return;
    }

    this.closeModal();
  }
}
