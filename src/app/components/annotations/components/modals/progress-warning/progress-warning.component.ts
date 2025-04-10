import { Component, Input } from "@angular/core";
import { ModalComponent } from "@menu/widget.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "baw-progress-warning-modal",
    template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirm Loss of Progress</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="closeModal(false)"
      ></button>
    </div>

    <div class="modal-body">
      <p>
        Because you have changed the verification search parameters, your
        progress will be reset if you continue.
      </p>

      <p>
        Do you wish to reset your progress and continue with the new search
        parameters?
      </p>

      <p>
        <!-- TODO: replace with don't worry everything have been saved when we implement server persistence -->
        If you do wish to continue, make sure you download the annotations you
        have already done first.
      </p>

      <div class="clearfix">
        <button
          id="close-btn"
          class="btn btn-outline-primary float-start"
          (click)="closeModal(false)"
        >
          Cancel
        </button>

        <button
          id="success-btn"
          class="btn btn-danger text-white float-end"
          (click)="closeModal(true)"
        >
          Reset Progress and Continue
        </button>
      </div>
    </div>
  `
})
export class ProgressWarningComponent implements ModalComponent {
  @Input() public modal: NgbActiveModal;

  public closeModal(status: boolean): void {
    this.modal.close(status);
  }
}
