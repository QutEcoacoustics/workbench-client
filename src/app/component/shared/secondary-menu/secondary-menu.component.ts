import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MenuLink } from "src/app/interfaces/layout-menus.interfaces";
import { PageInfo } from "src/app/interfaces/PageInfo";
import { List } from "immutable";
import { GetPageInfo } from "src/app/interfaces/Page";
import { LoginComponent } from "../../authentication/pages/login/login.component";
import { RegisterComponent } from "../../authentication/pages/register/register.component";

@Component({
  selector: "app-secondary-menu",
  templateUrl: "./secondary-menu.component.html",
  styleUrls: ["./secondary-menu.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecondaryMenuComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  secondaryLinks: List<MenuLink> = List([
    GetPageInfo(LoginComponent),
    GetPageInfo(RegisterComponent)
  ]);

  ngOnInit() {
    this.route.data.subscribe((val: PageInfo) => {
      if (val.menus.links) {
        console.debug("Links to add: ", val.menus.links);
        this.secondaryLinks = this.secondaryLinks.concat(val.menus.links);
      }
    });
  }
}
