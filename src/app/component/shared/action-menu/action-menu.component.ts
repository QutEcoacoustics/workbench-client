import { Component, OnInit } from "@angular/core";
import {
  LabelAndIcon,
  ActionItem
} from "src/app/interfaces/layout-menus.interfaces";
import { PageInfo } from "src/app/interfaces/PageInfo";
import { ActivatedRoute } from "@angular/router";
import { List } from "immutable";

@Component({
  selector: "app-action-menu",
  templateUrl: "./action-menu.component.html",
  styleUrls: ["./action-menu.component.scss"]
})
export class ActionMenuComponent implements OnInit {
  actionTitle: LabelAndIcon = {
    label: "Home",
    icon: ["fas", "home"]
  };
  actionLinks: List<ActionItem> = List<ActionItem>([]);

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe((val: PageInfo) => {
      if (!val.menus || !val.menus.actions) {
        return;
      }

      this.actionTitle = val.category;
      this.actionLinks = val.menus.actions;
    });
  }
}
