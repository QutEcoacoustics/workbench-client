import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  LayoutMenus,
  LayoutMenusInterface,
  Route
} from 'src/app/services/layout-menus/layout-menus.interface';
import {
  HeaderItem,
  HeaderItemInterface
} from 'src/app/component/shared/header/header.interface';

@Component({
  selector: 'app-about-home',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class AboutContactComponent implements OnInit, LayoutMenus, HeaderItem {
  private _jsonURL = 'assets/templates/contact-form-template.json';
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];
  error: string;

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

  clearError() {
    this.error = null;
  }

  submit(model: any) {
    if (this.form.status === 'INVALID') {
      return;
    }

    console.log(model);
  }

  getHeaderItem(): Readonly<HeaderItemInterface> {
    return Object.freeze({
      icon: ['fas', 'users'],
      label: 'Contact Us',
      uri: new Route('/about/contact')
    });
  }
  getMenus(): Readonly<LayoutMenusInterface> {
    return undefined;
  }
}
