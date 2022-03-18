import { Component, Input, OnChanges } from "@angular/core";
import { User } from "@models/User";
import { DateTime } from "luxon";

/**
 * App User Badge Component.
 * A single menu widget displaying a user account and its relationship to the model
 */
@Component({
  selector: "baw-user-badge",
  template: `
    <div *ngFor="let user of models">
      <!-- Spinner -->
      <baw-loading *ngIf="user | isUnresolved"></baw-loading>

      <!-- User Resolved -->
      <div *ngIf="!(user | isUnresolved)" id="users" class="d-flex mb-1">
        <!-- User image -->
        <div class="image me-2 mt-auto mb-auto">
          <!-- Add link to non-ghost users -->
          <ng-container *ngIf="!(user | isGhostUser); else userImage">
            <a id="imageLink" [bawUrl]="user.viewUrl">
              <ng-container *ngTemplateOutlet="userImage"></ng-container>
            </a>
          </ng-container>

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
          <span
            *ngIf="timestamp"
            id="lengthOfTime"
            style="word-wrap: break-word"
          >
            <small>{{ timestamp | toRelative }}</small>
          </span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./user-badge.component.scss"],
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
