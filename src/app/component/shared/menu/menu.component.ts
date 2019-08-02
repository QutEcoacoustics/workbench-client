import { Component, OnInit, Input } from "@angular/core";
import {
  LabelAndIcon,
  MenuLink,
  Href,
  MenuAction
} from "src/app/interfaces/layout-menus.interfaces";
import { List } from "immutable";
import { Route } from "@angular/router";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"]
})
export class MenuComponent implements OnInit {
  @Input() title?: LabelAndIcon;
  @Input() links: List<MenuAction | MenuLink>;
  @Input() type: "action" | "secondary";

  constructor() {}

  ngOnInit() {}

  isInternalLink(action: Function | Location): action is Route {
    return typeof action === "object";
  }

  isExternalLink(action: Function | Location): action is Href {
    return typeof action === "string";
  }

  isButton(action: Function | Location): action is Function {
    return typeof action === "function";
  }
}
