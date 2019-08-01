import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  RouteFragment, Icon
} from "src/app/interfaces/layout-menus.interfaces";
import { Page } from "src/app/interfaces/PageInfo";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "key"],
  label: "Reset password",
  category: securityCategory,
  routeFragment: "reset_password",
  tooltip: () => "Send an email to reset your password",
  menus: {
    actions: null,
    links: null
  }
})
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent implements OnInit {
  output: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    console.debug("Reset Password Component");
    console.debug(this.router);
    this.route.data.subscribe(val => {
      console.debug(val);
      this.output = JSON.stringify(val);
    });
  }
}
