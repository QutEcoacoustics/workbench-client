import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core"
import { securityCategory } from "../../authentication";
import { Page } from "src/app/interfaces/PageInfo";

@Page({
  icon: ["fas", "user-plus"],
  label: "Register",
  category: securityCategory,
  routeFragment: "register",
  tooltip: () => "Create an account",
  predicate: user => !user,
  menus: null
})
@Component({
  selector: "app-authentication-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  private formSchemaUrl = "assets/templates/register-form-template.json";
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];

  constructor(private http: HttpClient) {}

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
