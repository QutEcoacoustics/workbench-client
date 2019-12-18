import { Component, OnInit } from "@angular/core";
import { List } from "immutable";
import { Page } from "src/app/helpers/page/pageDecorator";
import { AnyMenuItem } from "src/app/interfaces/menusInterfaces";
import {
  editProfileMenuItem,
  profileCategory,
  profileMenuItem
} from "../../profile.menus";

@Page({
  category: profileCategory,
  menus: {
    actions: List<AnyMenuItem>([profileMenuItem, editProfileMenuItem]),
    links: List()
  },
  self: editProfileMenuItem
})
@Component({
  selector: "app-edit",
  templateUrl: "./edit.component.html",
  styleUrls: ["./edit.component.scss"]
})
export class EditComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
