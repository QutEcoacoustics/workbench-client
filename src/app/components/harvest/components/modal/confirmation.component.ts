import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgClass } from "@angular/common";

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
        <button id="cancel-btn" class="btn btn-outline-primary float-start" (click)="close()">
          {{ cancelLabel }}
        </button>
        <button
          id="next-btn"
          class="btn float-end"
          [ngClass]="this.isDanger ? 'btn-danger text-white' : 'btn-primary'"
          (click)="continue()"
        >
          {{ nextLabel }}
        </button>
      </div>
    </div>
  `,
  imports: [NgClass]
})
export class ConfirmationComponent {
  @Input() public nextLabel: string;
  @Input() public cancelLabel = "Cancel";
  @Input() public isDanger: boolean;
  @Input() public modal: NgbActiveModal;

  public close(): void {
    this.modal.close(false);
  }

  public continue(): void {
    this.modal.close(true);
  }
}
