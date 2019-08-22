import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { User } from "src/app/models/User";

@Component({
  selector: "app-user-badge",
  templateUrl: "./user-badge.component.html",
  styleUrls: ["./user-badge.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserBadgeComponent implements OnInit {
  @Input() label: string;
  @Input() user: User;

  constructor() {}

  ngOnInit() {}
}
