import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BawApiService } from 'src/app/services/baw-api/baw-api.service';
import { Router } from '@angular/router';
import { MenusService } from './menus.service';
import { Link, ActionTitle } from 'src/app/services/layout-menus/menus';

@Component({
  selector: 'app-authentication-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class AuthenticationLoginComponent implements OnInit {
  private _jsonURL = 'assets/templates/login-form-template.json';
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];
  error: string;

  secondaryLinks: Link[];
  actionLinks: Link[];
  actionTitle: ActionTitle;

  constructor(
    private http: HttpClient,
    private api: BawApiService,
    private router: Router,
    private menus: MenusService
  ) {}

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

  /**
   * Retrieve the form template in JSON
   * @returns Observable JSON containing form details
   */
  getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  /**
   * Clear form error
   */
  clearError() {
    this.error = null;
  }

  /**
   * Form submission
   * @param model Form response
   */
  submit(model: any) {
    if (this.form.status === 'INVALID') {
      return;
    }

    console.log(model);
    this.api.login(model).subscribe(data => {
      console.log(data);
      if (typeof data === 'string') {
        this.error = data;
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
