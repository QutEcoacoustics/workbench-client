import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { Observable } from "rxjs";

import { Page, PageComponent } from "src/app/interfaces/PageInfo";
import { securityCategory } from "../../authentication";

@Page({
  icon: ["fas", "envelope"],
  label: "Confirm account",
  category: securityCategory,
  routeFragment: "confirmation",
  tooltip: () => "Resend the email to confirm your account",
  menus: null,
  order: { priority: 2, indentation: 1 }
})
@Component({
  selector: "app-confirm-account",
  templateUrl: "./confirm-account.component.html",
  styleUrls: ["./confirm-account.component.scss"]
})
export class ConfirmPasswordComponent extends PageComponent implements OnInit {
  private formSchemaUrl = "assets/templates/confirm-account.json";
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
