import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { BawApiService } from 'src/app/services/baw-api/baw-api.service';
import { Router, Routes } from '@angular/router';
import {
  Route,
  PageInfo
} from 'src/app/services/layout-menus/layout-menus.interface';
import { Category } from '../../authentication';

@Component({
  selector: 'app-authentication-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  private _jsonURL = 'assets/templates/login-form-template.json';
  form: FormGroup;
  model: {};
  fields: FormlyFieldConfig[];
  error: string;

  constructor(
    private http: HttpClient,
    private api: BawApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = new FormGroup({});
    this.getJSON().subscribe(data => {
      this.model = data.model;
      this.fields = data.fields;
    });
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

// getHeaderItem(): Readonly<HeaderItemInterface> {
//   return Object.freeze({
//     icon: ['fas', 'sign-in-alt'],
//     label: 'Log in',
//     uri: new Route('/login')
//   });
// }
// getMenus(): Readonly<LayoutMenusInterface> {
//   return menus;
// }
// getSecondaryItem(): Readonly<SecondaryLinkInterface> {
//   return Object.freeze({
//     icon: ['fas', 'sign-in-alt'],
//     label: 'Log in',
//     uri: new Route('/login'),
//     tooltip: 'Log into the website',
//     predicate: loggedin => loggedin
//   });
// }
const pageInfo: PageInfo = {
  icon: ['fas', 'sign-in-alt'],
  label: 'Log in',
  category: Category,
  tooltip: () => 'Log into the website',
  actions: null,
  links: null,
  uri: new Route('login')
};

export const loginRoutes: Routes = [
  {
    path: pageInfo.uri.uri,
    component: LoginComponent,
    data: pageInfo
  }
];
