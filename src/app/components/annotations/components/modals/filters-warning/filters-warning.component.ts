import { Component, Input } from "@angular/core";
import { ModalComponent } from "@menu/widget.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-filters-warning-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirm Broad Filter Conditions</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="closeModal(false)"
      ></button>
    </div>

    <div class="modal-body">
      <p>
        You are seeing <em>all</em> ({{ itemCount | number }}) annotations
        because no search filters were used.
      </p>

      <p>
        You can verify all the annotations in one go, but it may take a long
        time to complete and it will be difficult to navigate.
      </p>

      <p>We suggest breaking up the task into smaller chunks.</p>

      <div class="clearfix">
        <button
          class="btn btn-outline-primary float-start"
          (click)="closeModal(false)"
        >
          Cancel
        </button>

        <button class="btn btn-primary float-end" (click)="closeModal(true)">
          Proceed
        </button>
      </div>
    </div>
  `,
})
export class FiltersWarningModalComponent implements ModalComponent {
  @Input({ required: true }) public modal: NgbActiveModal;
  @Input({ required: true }) public itemCount: number;

  public closeModal(status: boolean): void {
    this.modal.close(status);
  }
}