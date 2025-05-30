import { Component } from "@angular/core";
import { contactUsMenuItem } from "@components/about/about.menus";
import { StrongRoute } from "@interfaces/strongRoute";
import { DeleteModalComponent } from "@shared/delete-modal/delete-modal.component";
import { StrongRouteDirective } from "@directives/strongRoute/strong-route.directive";

@Component({
  selector: "baw-delete-site-modal",
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Delete {{ isPoint ? "Point" : "Site" }}</h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="dismissModal(false)"
      ></button>
    </div>

    <div class="modal-body">
      <span id="subTitle">
        <p>
          Are you certain you wish to delete this
          {{ isPoint ? "point" : "site" }}?
        </p>
      </span>

      <p class="alert alert-warning">
        When this {{ isPoint ? "point" : "site" }} is deleted it will be made
        invisible. For data safety: all audio recordings will no longer be
        accessible but will be recoverable. If you need to recover these
        recordings after they have been deleted, please
        <a [strongRoute]="contactUsRoute" (click)="dismissModal(false)">Contact Us</a>.
      </p>
    </div>

    <div class="modal-footer">
      <a class="btn btn-outline-primary" (click)="closeModal(false)">Cancel</a>
      <a class="btn btn-danger text-white" (click)="deleteModel()">Delete</a>
    </div>
  `,
  imports: [StrongRouteDirective],
})
export class DeleteSiteModalComponent extends DeleteModalComponent {
  public constructor() {
    super();
  }

  public isPoint: boolean;
  protected contactUsRoute: StrongRoute = contactUsMenuItem.route;
}
