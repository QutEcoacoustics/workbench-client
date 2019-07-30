import { Component, OnInit, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRoute, Data } from '@angular/router';
import {
  PageInfo,
  Route
} from '../../../../services/layout-menus/layout-menus.interface';
import { Category } from '../../authentication';

// @Routes({

// })
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  output: string;

  constructor(private _route: ActivatedRoute) {}

  ngOnInit() {
    console.debug(this._route.data);
    this._route.data.subscribe(val => {
      console.debug(val);
      this.output = JSON.stringify(val);
    });
  }
}

const pageInfo: PageInfo = {
  icon: ['fas', 'unlock'],
  label: 'Reset password',
  category: Category,
  tooltip: () => 'Send an email to reset your password',
  actions: null,
  links: null,
  uri: new Route('reset_password')
};

export const resetRoutes: Routes = [
  {
    path: pageInfo.uri.uri,
    component: ResetPasswordComponent,
    data: pageInfo
  }
];
