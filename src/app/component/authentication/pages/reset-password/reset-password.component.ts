import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Observable } from "rxjs";

import { Page, PageComponent } from "src/app/interfaces/PageInfo";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "key"],
  label: "Reset password",
  category: securityCategory,
  routeFragment: "reset_password",
  tooltip: () => "Send an email to reset your password",
  menus: null,
  order: 2.1
})
@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"]
})
export class ResetPasswordComponent extends PageComponent implements OnInit {
  private formSchemaUrl = "assets/templates/forgot-password.json";
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];

  constructor(private http: HttpClient) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({});
    this.getJSON().subscribe(data => {
      this.model = data.model;
      this.fields = data.fields;
    });
  }

  getJSON(): Observable<any> {
    return this.http.get(this.formSchemaUrl);
  }

  submit(model) {
    console.log(model);
  }
}
