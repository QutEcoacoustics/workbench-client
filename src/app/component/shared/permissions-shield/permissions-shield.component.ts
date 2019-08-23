import { Component, Input, OnInit } from "@angular/core";
import { User } from "src/app/models/User";
import { WidgetComponent } from "../widget/widget.component";

@Component({
  selector: "app-permissions-shield",
  templateUrl: "./permissions-shield.component.html",
  styleUrls: ["./permissions-shield.component.scss"]
})
export class PermissionsShieldComponent implements OnInit, WidgetComponent {
  @Input() data: any;

  createdBy: User[];
  modifiedBy: User[];
  ownedBy: User[];

  constructor() {}

  ngOnInit() {
    const testAccount = new User({
      id: 1,
      userName: "Admin",
      rolesMask: 1,
      timezoneInformation: null,
      rolesMaskNames: ["admin"],
      imageUrls: [
        {
          size: "extralarge" as "extralarge",
          url: "/images/user/user_span4.png",
          width: 300,
          height: 300
        },
        {
          size: "large" as "large",
          url: "/images/user/user_span3.png",
          width: 220,
          height: 220
        },
        {
          size: "medium" as "medium",
          url: "/images/user/user_span2.png",
          width: 140,
          height: 140
        },
        {
          size: "small" as "small",
          url: "/images/user/user_span1.png",
          width: 60,
          height: 60
        },
        {
          size: "tiny" as "tiny",
          url: "/images/user/user_spanhalf.png",
          width: 30,
          height: 30
        }
      ],
      lastSeenAt: "2019-08-22T17:22:40.080+10:00",
      preferences: {
        volume: 1,
        muted: false,
        autoPlay: true,
        visualize: {
          hideImages: false,
          hideFixed: true
        },
        setting: [1, 2, 3]
      },
      isConfirmed: true
    });

    this.createdBy = [testAccount];
    this.modifiedBy = [testAccount];
    this.ownedBy = [testAccount];
  }
}
