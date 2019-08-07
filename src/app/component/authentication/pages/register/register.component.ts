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
  private formSchemaUrl = "assets/templates/register.json";
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];

  constructor(private http: HttpClient) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({});
    this.getJSON().subscribe(data => {
      // Convert json string to function
      const expression = new Function(
        "control",
        data.fields[0].validators.fieldMatch.expression
      );

      data.fields[0].validators.fieldMatch.expression = expression;

      console.log(data);

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
