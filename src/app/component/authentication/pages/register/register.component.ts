import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  Route,
  PageInfo
} from 'src/app/services/layout-menus/layout-menus.interface';
import { Routes } from '@angular/router';
import { Category } from '../../authentication';

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

  // getHeaderItem(): Readonly<HeaderItemInterface> {
  //   return Object.freeze({
  //     icon: ['fas', 'user-plus'],
  //     label: 'Register',
  //     uri: new Route('/register')
  //   });
  // }
  // getMenus(): Readonly<LayoutMenusInterface> {
  //   return menus;
  // }
  // getSecondaryItem(): Readonly<SecondaryLinkInterface> {
  //   return Object.freeze({
  //     icon: ['fas', 'user-plus'],
  //     label: 'Register',
  //     uri: new Route('/register'),
  //     tooltip: 'Create an account',
  //     predicate: loggedin => loggedin
  //   });
  // }
}

const pageInfo: PageInfo = {
  icon: ['fas', 'user-plus'],
  label: 'Register',
  category: Category,
  tooltip: () => 'Create an account',
  actions: null,
  links: null,
  uri: new Route('register')
};

export const registerRoutes: Routes = [
  {
    path: pageInfo.uri.uri,
    component: RegisterComponent,
    data: pageInfo
  }
];
