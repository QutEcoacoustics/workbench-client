import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import {
  LayoutMenus,
  SecondaryLink,
  Route,
  LayoutMenusInterface,
  SecondaryLinkInterface
} from 'src/app/services/layout-menus/layout-menus.interface';
import {
  HeaderItem,
  HeaderItemInterface
} from 'src/app/component/shared/header/header.interface';

@Component({
  selector: 'app-about-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class AboutReportComponent
  implements OnInit, LayoutMenus, HeaderItem, SecondaryLink {
  private _jsonURL = 'assets/templates/report-form-template.json';
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
      icon: ['fas', 'bug'],
      label: 'Report Problem',
      uri: new Route('/about/report')
    });
  }
  getMenus(): Readonly<LayoutMenusInterface> {
    return undefined;
  }
  getSecondaryItem(): Readonly<SecondaryLinkInterface> {
    return Object.freeze({
      icon: ['fas', 'bug'],
      label: 'Report Problem',
      uri: new Route('/about/report'),
      tooltip: 'Report a problem with the website'
    });
  }
}
