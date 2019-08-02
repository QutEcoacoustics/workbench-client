import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  NavigableMenuItem} from "src/app/interfaces/layout-menus.interfaces";
import { PageInfo } from "src/app/interfaces/PageInfo";
import { List } from "immutable";
import { DefaultMenu } from "src/app/services/layout-menus/defaultMenus";

@Component({
  selector: "app-secondary-menu",
  templateUrl: "./secondary-menu.component.html",
  styleUrls: ["./secondary-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondaryMenuComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
  ) {  }

  contextLinks: List<NavigableMenuItem>;

  ngOnInit() {
    this.route.data.subscribe((val: PageInfo) => {
      // get default links
      const defaultLinks = DefaultMenu.contextLinks;
      // and current page
      const current = val;
      // with any links from route
      const links =
        val && val.menus && val.menus.links ?
        val.menus.links :
        List<NavigableMenuItem>();

      // and add it all together
      const allLinks = defaultLinks.concat(links, current);

      // TODO: ordering
      // TODO: check for duplicates

      if (!links.isEmpty) {
        console.log("Links menu found");
        console.log(links);
      }

      this.contextLinks = allLinks;
    });
  }
}
