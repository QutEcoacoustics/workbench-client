import { Component, Input } from "@angular/core";
import { ModalComponent } from "@menu/widget.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-reset-progress-warning-modal",
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
        Because you have changed the verification tasks search parameters, your
        progress will be reset if you continue.
      </p>

      <p>
        Do you wish to reset your progress and continue with the new search
        parameters?
      </p>

      <div class="clearfix">
        <button
          id="cancel-btn"
          class="btn btn-outline-primary float-start"
          (click)="closeModal(false)"
        >
          Cancel
        </button>

        <button
          id="next-btn"
          class="btn btn-danger text-white float-end"
          (click)="success()"
        >
          Reset Progress and Continue
        </button>
      </div>
    </div>
  `,
})
export class ResetProgressWarningComponent implements ModalComponent {
  @Input() public modal: NgbActiveModal;

  public closeModal(status: boolean): void {
    this.modal.close(status);
  }

  public success(): void {
    this.closeModal(true);
  }
}
