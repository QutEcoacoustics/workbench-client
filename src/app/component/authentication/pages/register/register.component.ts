import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  SecondaryLink,
  LayoutMenus,
  Route,
  LayoutMenusInterface,
  SecondaryLinkInterface
} from 'src/app/services/layout-menus/layout-menus.interface';
import {
  HeaderItem,
  HeaderItemInterface
} from 'src/app/component/shared/header/header.interface';
import { menus } from './register.component.menus';

@Component({
  selector: 'app-authentication-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class AuthenticationRegisterComponent
  implements OnInit, LayoutMenus, HeaderItem, SecondaryLink {
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

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'user-plus'],
      label: 'Register',
      uri: new Route('/register')
    });
  }
  getMenus(): Readonly<LayoutMenusInterface> {
    return menus;
  }
  getSecondaryItem(): Readonly<SecondaryLinkInterface> {
    return Object.freeze({
      icon: ['fas', 'user-plus'],
      label: 'Register',
      uri: new Route('/register'),
      tooltip: 'Create an account',
      predicate: loggedin => loggedin
    });
  }
}
