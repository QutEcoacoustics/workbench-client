import { Component, Input, OnChanges } from "@angular/core";
import { User } from "@models/User";
import { DateTime } from "luxon";
import { NgTemplateOutlet } from "@angular/common";
import { UrlDirective } from "@directives/url/url.directive";
import { AuthenticatedImageDirective } from "@directives/image/image.directive";
import { LoadingComponent } from "../../loading/loading.component";
import { UserLinkComponent } from "../../user-link/user-link.component";
import { TimeSinceComponent } from "../../datetime-formats/time-since/time-since.component";
import { IsGhostUserPipe } from "../../../../pipes/is-ghost-user/is-ghost-user.pipe";
import { IsUnresolvedPipe } from "../../../../pipes/is-unresolved/is-unresolved.pipe";

/**
 * App User Badge Component.
 * A single menu widget displaying a user account and its relationship to the model
 */
@Component({
  selector: "baw-user-badge",
  template: `
    @for (user of models; track user) {
      <div>
        <!-- Spinner -->
        @if (user | isUnresolved) {
          <baw-loading></baw-loading>
        }

        <!-- User Resolved -->
        @if (!(user | isUnresolved)) {
          <div id="users" class="d-flex mb-1">
            <!-- User image -->
            <div class="image me-2 mt-auto mb-auto">
              <!-- Add link to non-ghost users -->
              @if (!(user | isGhostUser)) {
                <a id="imageLink" [bawUrl]="user.viewUrl">
                  <ng-container *ngTemplateOutlet="userImage"></ng-container>
                </a>
              } @else {
                <img
                  class="rounded"
                  [src]="user.imageUrls"
                  [alt]="user.userName + ' profile picture'"
                  />
              }

              <!-- User Image -->
              <ng-template #userImage>
                <img
                  class="rounded"
                  [src]="user.imageUrls"
                  [alt]="user.userName + ' profile picture'"
                />
              </ng-template>
            </div>

            <!-- User details -->
            <div class="body">
              <baw-user-link class="fs-5" [user]="user"></baw-user-link>

              <!-- Timestamp -->
              <br />
              @if (timestamp) {
                <span
                  id="lengthOfTime"
                  style="word-wrap: break-word"
                >
                  <small>
                    <baw-time-since [value]="timestamp" />
                  </small>
                </span>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  styleUrls: ["./user-badge.component.scss"],
  imports: [
    LoadingComponent,
    UrlDirective,
    NgTemplateOutlet,
    AuthenticatedImageDirective,
    UserLinkComponent,
    TimeSinceComponent,
    IsGhostUserPipe,
    IsUnresolvedPipe,
  ],
})
export class UserBadgeComponent implements OnChanges {
  @Input() public label: string;
  @Input() public users: User | User[];
  @Input() public timestamp?: DateTime;
  public models: User[];

  public ngOnChanges(): void {
    if (!this.users) {
      this.models = [];
    } else if (this.users instanceof Array) {
      this.models = this.users;
    } else {
      this.models = [this.users];
    }
  }
}
