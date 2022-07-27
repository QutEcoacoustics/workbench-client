import { Component, EventEmitter, Input, Output } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-harvest-confirmation-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirm</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="close()"
      ></button>
    </div>

    <div class="modal-body">
      <ng-content></ng-content>

      <div class="clearfix">
        <button class="btn btn-outline-primary float-start" (click)="close()">
          {{ cancelLabel }}
        </button>
        <button class="btn btn-primary float-end" (click)="continue()">
          {{ nextLabel }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmationComponent {
  @Input() public nextLabel: string;
  @Input() public cancelLabel = "Cancel";
  @Input() public modal: NgbActiveModal;
  @Output() public confirm = new EventEmitter<void>();

  public close(): void {
    this.modal.dismiss("close");
  }

  public continue(): void {
    this.modal.close("next");
  }
}
