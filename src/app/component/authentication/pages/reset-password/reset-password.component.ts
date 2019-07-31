import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ComponentInfoInterface,
  InternalRoute
} from 'src/app/interfaces/layout-menus.interfaces';
import { securityCategory } from '../../authentication';

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
  }
}

export const resetComponentInfo: ComponentInfoInterface = {
  icon: ['fas', 'unlock'],
  label: 'Reset password',
  category: securityCategory,
  uri: (securityCategory.route + '/reset_password') as InternalRoute,
  sub_route: 'reset_password' as InternalRoute,
  tooltip: () => 'Send an email to reset your password'
};
