import { Component, OnInit } from '@angular/core';
import { Routes, ActivatedRoute } from '@angular/router';
import { Category } from '../../authentication';
import { PageInfo, Route } from 'src/app/interfaces/layout-menus.interfaces';

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
  uri: 'reset_password' as Route
};

export const resetRoutes: Routes = [
  {
    path: pageInfo.uri,
    component: ResetPasswordComponent,
    data: pageInfo
  }
];
