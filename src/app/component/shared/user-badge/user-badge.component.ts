import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { ImageSizes, Time } from "src/app/interfaces/apiInterfaces";
import { User } from "src/app/models/User";

@Component({
  selector: "app-user-badge",
  template: `
    <h4>{{ label }}</h4>
    <ng-container *ngIf="userNotFound; else userFound">
      <p>User not found</p>
    </ng-container>
    <ng-template #userFound>
      <div class="media" *ngFor="let user of users">
        <div class="image">
          <a [href]="user.user.url">
            <img
              [src]="user.user.getImage(imageSize)"
              [alt]="user.user.userName"
            />
          </a>
        </div>
        <div class="body">
          <a class="heading" [href]="user.user.url">{{ user.user.userName }}</a>
          <br />
          <p style="word-wrap: break-word" *ngIf="user.time">
            Last Seen: {{ user.time }}
          </p>
        </div>
      </div>
    </ng-template>
  `,
  styleUrls: ["./user-badge.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBadgeComponent implements OnInit {
  @Input() label: string;
  @Input() users: UserBadge[];

  userNotFound: boolean;
  imageSize = ImageSizes.small;

  constructor() {}

  ngOnInit() {
    this.userNotFound = this.users ? this.users.length === 0 : true;
  }
}

export interface UserBadge {
  user: User;
  time: Time;
}
