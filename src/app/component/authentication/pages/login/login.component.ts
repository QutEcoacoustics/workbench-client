import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { List } from "immutable";
import { Observable } from "rxjs";

import { AnyMenuItem } from "src/app/interfaces/layout-menus.interfaces";
import { Page, PageComponent } from "src/app/interfaces/PageInfo";
import { BawApiService } from "src/app/services/baw-api/baw-api.service";
import { securityCategory } from "../../authentication";
import { ConfirmPasswordComponent } from "../confirm-account/confirm-account.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";

@Page({
  icon: ["fas", "sign-in-alt"],
  label: "Log in",
  category: securityCategory,
  routeFragment: "login",
  tooltip: () => "Log into the website",
  predicate: user => !user,
  order: { priority: 2, indentation: 0 },
  menus: {
    actions: List<AnyMenuItem>([
      ResetPasswordComponent.pageInfo,
      ConfirmPasswordComponent.pageInfo,
      {
        kind: "MenuAction",
        icon: ["fas", "lock-open"],
        label: "Unlock account",
        tooltip: () => "Send an email to unlock your account",
        action: () => console.log("Unlock account")
      }
    ]),
    links: null
  }
})
@Component({
  selector: "app-authentication-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent extends PageComponent implements OnInit {
  private formSchemaUrl = "assets/templates/login.json";
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];
  error: string;

  constructor(
    private http: HttpClient,
    private api: BawApiService,
    private router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({});
    this.getJSON().subscribe(data => {
      this.model = data.model;
      this.fields = data.fields;
    });
  }

  /**
   * Retrieve the form template in JSON
   * @returns Observable JSON containing form details
   */
  getJSON(): Observable<any> {
    return this.http.get(this.formSchemaUrl);
  }

  /**
   * Clear form error
   */
  clearError() {
    this.error = null;
  }

  /**
   * Form submission
   * @param model Form response
   */
  submit(model: any) {
    if (this.form.status === "INVALID") {
      return;
    }

    console.log(model);
    this.api.login(model).subscribe(data => {
      console.log(data);
      if (typeof data === "string") {
        this.error = data;
      } else {
        this.router.navigate(["/"]);
      }
    });
  }
}
