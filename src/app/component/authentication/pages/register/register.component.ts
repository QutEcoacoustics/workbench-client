import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Observable } from "rxjs";

import { Page, PageComponent } from "src/app/interfaces/PageInfo";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "user-plus"],
  label: "Register",
  category: securityCategory,
  routeFragment: "register",
  tooltip: () => "Create an account",
  predicate: user => !user,
  menus: null,
  order: { priority: 3, indentation: 0 }
})
@Component({
  selector: "app-authentication-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent extends PageComponent implements OnInit {
  schemaUrl = "assets/templates/register.json";

  constructor(private http: HttpClient) {
    super();
  }

  ngOnInit() {}

  submit(model) {
    console.log(model);
  }
}
