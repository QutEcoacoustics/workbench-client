import { Component, Input } from "@angular/core";
import { ImageSizes } from "@interfaces/apiInterfaces";
import { User } from "@models/User";
import { DateTime } from "luxon";

/**
 * App User Badge Component.
 * A single menu widget displaying a user account and its relationship to the model
 */
@Component({
  selector: "baw-user-badge",
  template: `
    <!-- Heading -->
    <h5 id="label">{{ label }}</h5>

    <!-- Spinner -->
    <baw-loading *ngIf="user | isUnresolved"></baw-loading>

    <!-- User Resolved -->
    <ng-container *ngIf="!(user | isUnresolved)">
      <div id="users" class="d-flex mb-1">
        <!-- User image -->
        <div class="image">
          <!-- Normal User -->
          <a
            *ngIf="!(user | isGhostUser); else userImage"
            id="imageLink"
            [bawUrl]="user.viewUrl"
          >
            <ng-container *ngTemplateOutlet="userImage"></ng-container>
          </a>

          <!-- Ghost User -->
          <ng-template #userImage>
            <img
              [src]="user.image"
              [alt]="user.userName + ' profile picture'"
              [thumbnail]="thumbnail"
            />
          </ng-template>
        </div>

        <!-- User details -->
        <div class="body">
          <!-- Ghost User -->
          <ng-container *ngIf="user | isGhostUser; else isUser" class="heading">
            <span id="ghost-username">{{ user.userName }}</span>
          </ng-container>

          <!-- Normal User -->
          <ng-template #isUser>
            <a id="username" class="heading" [bawUrl]="user.viewUrl">
              {{ user.userName }}
            </a>
          </ng-template>

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
    </ng-container>
  `,
  styleUrls: ["./user-badge.component.scss"],
})
export class UserBadgeComponent {
  @Input() public label: string;
  @Input() public user: User;
  @Input() public timestamp?: DateTime;
  public thumbnail = ImageSizes.small;
}
