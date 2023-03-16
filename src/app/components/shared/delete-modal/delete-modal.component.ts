import { Component, Input } from "@angular/core";
import { withUnsubscribe } from "@helpers/unsubscribe/unsubscribe";
import { ModalComponent } from "@menu/widget.component";

@Component({
  selector: "baw-delete-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Delete Item</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="dismissModal(false)"
      ></button>
    </div>

    <div class="modal-body">
        <span id="subTitle">
          <p>Are you certain you wish to delete this item?</p>
        </span>
    </div>

    <div class="modal-footer">
      <a class="btn btn-outline-primary" (click)="closeModal(false)">Cancel</a>
      <a class="btn btn-danger text-white" (click)="deleteModel()">Delete</a>
    </div>
  `,
})
export class DeleteModalComponent extends withUnsubscribe() implements ModalComponent {
  @Input() public successCallback?: () => void;

  // closeModal is used for when the modal is closed via an action by the user
  // while dismissModal should be called when the modal is dismissed via the escape key or the X button
  @Input() public closeModal: (result: any) => void;
  @Input() public dismissModal: (reason: any) => void;

  protected deleteModel(): void {
    // not all delete modals will have a success callback
    // for example, if directly embedded in a page, the modals success state can be directly fetched from the closed state the success
    // callback is therefore only used in the modal menu items where the menu item cannot be directly manipulating page / model states
    if (this.successCallback) {
      this.successCallback();
    }

    this.closeModal(true);
  }
}
