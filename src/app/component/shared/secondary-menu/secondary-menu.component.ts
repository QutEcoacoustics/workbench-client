import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuLink } from "src/app/interfaces/layout-menus.interfaces";
import { PageInfo } from "src/app/interfaces/PageInfo";
import { LayoutMenusService } from "src/app/services/layout-menus/layout-menus.service";
import { List } from "immutable";
import { GetPageInfo } from "src/app/interfaces/Page";
import { LoginComponent } from "../../authentication/pages/login/login.component";
import { RegisterComponent } from "../../authentication/pages/register/register.component";

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

  secondaryLinks: List<MenuLink> = List([GetPageInfo(LoginComponent)]);

  ngOnInit() {
    console.debug("Secondary Menu Component");
    console.debug(this.secondaryLinks);
    this.route.data.subscribe((val: PageInfo) => {
      console.debug(val);
      // this.secondaryLinks = this.layout.getSecondaryLinks(val.menus);
    });
  }
}
