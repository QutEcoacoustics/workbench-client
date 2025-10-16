import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  model,
  signal,
} from "@angular/core";
import { AnnotationSearchParameters } from "@components/annotations/pages/annotationSearchParameters";
import { ModalComponent } from "@menu/widget.component";
import { Project } from "@models/Project";
import { Region } from "@models/Region";
import { Site } from "@models/Site";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AnnotationSearchFormComponent } from "../../annotation-search-form/annotation-search-form.component";

@Component({
  selector: "baw-search-filters-modal",
  templateUrl: "./search-filters.component.html",
  imports: [AnnotationSearchFormComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchFiltersModalComponent implements ModalComponent {
  public readonly formValue = model.required<AnnotationSearchParameters>();
  public readonly modal = input<NgbActiveModal>();

  // TODO: Migrate this to a signal once we add support for signals to the
  // ModalComponent interface.
  @Input()
  public successCallback: (newModel: AnnotationSearchParameters) => void;

  public readonly project = input<Project>();
  public readonly region = input<Region>();
  public readonly site = input<Site>();
  public readonly hasDecisions = input(false);
  public readonly showVerificationFilters = input(true);
  public readonly showSortingFilters = input(true);

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
