import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "baw-harvest-confirmation-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Confirm</h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="modal.dismiss('cancel')"></button>
    </div>

    <div class="modal-body">
      <p>{{ description }}</p>

      <div class="clearfix">
        <div class="btn btn-outline-primary float-start" (click)="modal.dismiss('cancel')">{{ cancelBtn }}</div>
        <div class="btn btn-primary float-end" (click)="modal.close('next')">{{ nextBtn }}</div>
      </div>
    </div>
  `
})
export class ConfirmationComponent {
  @Input() public description: string;
  @Input() public cancelBtn: string;
  @Input() public nextBtn: string;

  public constructor(public modal: NgbActiveModal) {}
}
