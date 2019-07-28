import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable } from 'rxjs';

import { Link, ActionTitle } from 'src/app/services/layout-menus/menus';
import { MenusService } from './menus.service';

@Component({
  selector: 'app-about-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class AboutReportComponent implements OnInit {
  private _jsonURL = 'assets/templates/report-form-template.json';
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];
  error: string;
  secondaryLinks: Link[];
  actionLinks: Link[];
  actionTitle: ActionTitle;

  constructor(private http: HttpClient, private menus: MenusService) {}

  ngOnInit() {
    this.form = new FormGroup({});
    this.getJSON().subscribe(data => {
      this.model = data.model;
      this.fields = data.fields;
    });

    this.secondaryLinks = this.menus.secondaryMenu();
    this.actionTitle = this.menus.actionTitle();
    this.actionLinks = this.menus.actionLinks();
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
}
