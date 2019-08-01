import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  MenuLink} from "src/app/interfaces/layout-menus.interfaces";
import { PageInfo } from "src/app/interfaces/PageInfo";
import { LayoutMenusService } from "src/app/services/layout-menus/layout-menus.service";
import { List } from "immutable";

@Component({
  selector: "app-secondary-menu",
  templateUrl: "./secondary-menu.component.html",
  styleUrls: ["./secondary-menu.component.scss"]
})
export class SecondaryMenuComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private layout: LayoutMenusService
  ) {}

  secondaryLinks: List<MenuLink> = this.layout.getSecondaryLinks(null);

  ngOnInit() {
    console.debug("Secondary Menu Component");
    this.route.data.subscribe((val: PageInfo) => {
      console.debug(val);
      this.secondaryLinks = this.layout.getSecondaryLinks(val.menus);
    });
  }
}
