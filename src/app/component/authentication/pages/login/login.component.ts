import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { BawApiService } from "src/app/services/baw-api/baw-api.service";
import { Router } from "@angular/router";
import { ActionItem } from "src/app/interfaces/layout-menus.interfaces";
import { Page } from "src/app/interfaces/PageInfo";
import { securityCategory } from "../../authentication";
import { List } from "immutable";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";
import { GetPageInfo } from "src/app/interfaces/Page";

@Page({
  icon: ["fas", "sign-in-alt"],
  label: "Log in",
  category: securityCategory,
  routeFragment: "login",
  tooltip: () => "Log into the website",
  predicate: user => !user,
  menus: {
    actions: List([
      GetPageInfo(ResetPasswordComponent),
      {
        icon: ["fas", "envelope"],
        label: "Confirm account",
        tooltip: () => "Resend the email to confirm your account",
        action: () => console.log("Confirm account")
      },
      {
        icon: ["fas", "lock-open"],
        label: "Unlock account",
        tooltip: () => "Send an email to unlock your account",
        action: () => console.log("Unlock account")
      }
    ]) as List<ActionItem>,
    links: null
  }
})
@Component({
  selector: "app-authentication-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  private formSchemaUrl = "assets/templates/login-form-template.json";
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];
  error: string;

  constructor(
    private http: HttpClient,
    private api: BawApiService,
    private router: Router
  ) {}

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
