import {
  resetRoutes,
  ResetPasswordComponent
} from './pages/reset-password/reset-password.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  registerRoutes,
  RegisterComponent
} from './pages/register/register.component';
import { loginRoutes, LoginComponent } from './pages/login/login.component';

const children = [];
children.concat(resetRoutes);
children.concat(registerRoutes);
children.concat(loginRoutes);

export const AuthenticationComponents = [
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent
];

@NgModule({
  imports: [RouterModule.forChild(children)],
  exports: [RouterModule]
})
export class AuthenticationModule {}
