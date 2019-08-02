import { Component, OnInit } from "@angular/core";
import {
  LabelAndIcon,
  MenuAction,
  Href,
  Location,
  ActionItems
} from "src/app/interfaces/layout-menus.interfaces";
import { PageInfo } from "src/app/interfaces/PageInfo";
import { ActivatedRoute, Route } from "@angular/router";
import { LayoutMenusService } from "src/app/services/layout-menus/layout-menus.service";
import { List } from "immutable";

@Component({
  selector: "app-action-menu",
  templateUrl: "./action-menu.component.html",
  styleUrls: ["./action-menu.component.scss"]
})
export class ActionMenuComponent implements OnInit {
  actionTitle: LabelAndIcon;
  actionLinks: ActionItems;

  constructor(
    private route: ActivatedRoute,
    private layout: LayoutMenusService
  ) {}

  ngOnInit() {
    console.debug("Action Menu Component");
    this.route.data.subscribe((val: PageInfo) => {
      console.debug(val);
      const actionMenu = this.layout.getActionMenu(val.menus);

      if (actionMenu) {
        console.log("Action menu links found");
        console.log(actionMenu);

        this.actionTitle = val.category;
        this.actionLinks = actionMenu;
      }
    });
  }

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
