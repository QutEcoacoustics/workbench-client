import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit
} from "@angular/core";
import { List } from "immutable";
import { ImageSizes } from "src/app/interfaces/apiInterfaces";
import { User } from "src/app/models/User";

@Component({
  selector: "app-user-badge",
  template: `
    <h4 id="label">{{ label }}</h4>
    <ng-container *ngIf="userNotFound; else userFound">
      <p id="notFound">User not found</p>
    </ng-container>
    <ng-template #userFound>
      <div id="users">
        <div class="media" *ngFor="let user of users">
          <div class="image">
            <a id="imageLink" [routerLink]="user.url">
              <img
                [src]="user.getImage(imageSize)"
                [alt]="user.userName + ' profile picture'"
              />
            </a>
          </div>
          <div class="body">
            <a id="username" class="heading" [routerLink]="user.url">{{
              user.userName
            }}</a>
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
    </ng-template>
  `,
  styleUrls: ["./user-badge.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBadgeComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() users: List<User>;
  @Input() lengthOfTime: string;
  userNotFound: boolean;
  imageSize = ImageSizes.small;

  constructor() {}

  ngOnInit() {
    this.checkUserExists();
  }

  ngOnChanges() {
    this.checkUserExists();
  }

  private checkUserExists() {
    this.userNotFound = this.users ? this.users.count() === 0 : true;
  }
}

export interface Badge {
  label: string;
  users: List<User>;
  lengthOfTime: string;
}
