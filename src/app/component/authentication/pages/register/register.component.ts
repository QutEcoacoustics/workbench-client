import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  ComponentInfoInterface,
  InternalRoute
} from 'src/app/interfaces/layout-menus.interfaces';
import { securityCategory } from '../../authentication';

@Component({
  selector: 'app-authentication-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private _jsonURL = 'assets/templates/register-form-template.json';
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
    return this.http.get(this._jsonURL);
  }

  submit(model) {
    console.log(model);
  }
}

export const registerComponentInfo: ComponentInfoInterface = {
  icon: ['fas', 'user-plus'],
  label: 'Register',
  category: securityCategory,
  uri: (securityCategory.route + '/register') as InternalRoute,
  sub_route: 'register' as InternalRoute,
  tooltip: () => 'Create an account'
};
