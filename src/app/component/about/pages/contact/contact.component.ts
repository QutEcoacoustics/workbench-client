import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  SecondaryLink,
  ActionTitle,
  ActionLink
} from 'src/app/services/layout-menus/layout-menus.service';
import { MenusService } from './menus.service';

@Component({
  selector: 'app-about-home',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class AboutContactComponent implements OnInit {
  private _jsonURL = 'assets/templates/contact-form-template.json';
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];
  error: string;
  secondaryLinks: SecondaryLink[];
  actionTitle: ActionTitle;
  actionLinks: ActionLink[];

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

/**
 * Icon
 */
export const icon = ['fas', 'users'];
