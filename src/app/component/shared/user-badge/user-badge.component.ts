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
  templateUrl: "./user-badge.component.html",
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
