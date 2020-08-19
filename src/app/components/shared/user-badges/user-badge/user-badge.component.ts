import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
} from "@angular/core";
import { ImageSizes } from "@interfaces/apiInterfaces";
import { User } from "@models/User";
import { List } from "immutable";

/**
 * App User Badge Component.
 * A single menu widget displaying a user account and its relationship to the model
 */
@Component({
  selector: "baw-user-badge",
  template: `
    <!-- Heading -->
    <h4 id="label">{{ label }}</h4>

    <!-- No users -->
    <baw-loading [display]="loading"></baw-loading>

    <!-- No users -->
    <ng-container *ngIf="!loading && !userFound">
      <p id="notFound">User not found</p>
    </ng-container>

    <!-- Has users -->
    <ng-container *ngIf="!loading && userFound">
      <div id="users">
        <div class="media" *ngFor="let user of users">
          <!-- User image -->
          <div class="image">
            <a id="imageLink" [routerLink]="user.viewUrl">
              <img
                [src]="user.image"
                [alt]="user.userName + ' profile picture'"
                [thumbnail]="ImageSizes.SMALL"
              />
            </a>
          </div>

          <!-- Username and length of time -->
          <div class="body">
            <a id="username" class="heading" [routerLink]="user.viewUrl">
              {{ user.userName }}
            </a>
            <br />
            <p
              id="lengthOfTime"
              style="word-wrap: break-word"
              *ngIf="lengthOfTime"
            >
              {{ lengthOfTime }}
            </p>
          </div>
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ["./user-badge.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBadgeComponent implements OnChanges {
  @Input() public label: string;
  @Input() public users: List<User>;
  @Input() public lengthOfTime: string;
  @Input() public loading: boolean;
  public userFound: boolean;
  public ImageSizes = ImageSizes;

  constructor(private ref: ChangeDetectorRef) {}

  public ngOnChanges() {
    this.userFound = this.users?.count() > 0;
    this.ref.detectChanges();
  }
}

export interface Badge {
  label: string;
  loading: boolean;
  users?: List<User>;
  lengthOfTime?: string;
}
