import { Component, OnInit } from '@angular/core';
import { Routes, ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../authentication';
import { PageInfo, Route } from 'src/app/interfaces/layout-menus.interfaces';
import { SecondaryMenuComponent } from 'src/app/component/shared/secondary-menu/secondary-menu.component';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  output: string;

  constructor(private _route: ActivatedRoute, private _router: Router) {}

  ngOnInit() {
    console.debug('Reset Password Component');
    console.debug(this._router);
    this._route.data.subscribe(val => {
      console.debug(val);
      this.output = JSON.stringify(val);
    });

    this._router.navigate([{ outlets: { secondary: pageInfo.uri } }], {
      relativeTo: this._route
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
  },
  {
    path: pageInfo.uri,
    outlet: 'secondary',
    component: SecondaryMenuComponent,
    data: pageInfo
  }
];
