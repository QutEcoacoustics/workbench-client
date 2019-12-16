import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { PageComponent } from "src/app/helpers/page/pageComponent";
import { Page } from "src/app/helpers/page/pageDecorator";
import { myAccountCategory, profileMenuItem } from "../../my-account.menus";

@Page({
  category: myAccountCategory,
  menus: {
    actions: List(),
    links: List()
  },
  self: profileMenuItem
})
@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent extends PageComponent implements OnInit {
  constructor() {
    super();
  }

  ngOnInit() {}
}
