import {
  resetRoutes,
  ResetPasswordComponent
} from './pages/reset-password/reset-password.component';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  registerRoutes,
  RegisterComponent
} from './pages/register/register.component';
import { loginRoutes, LoginComponent } from './pages/login/login.component';

let children = [];
children = children.concat(resetRoutes);
children = children.concat(registerRoutes);
children = children.concat(loginRoutes);

const routes: Routes = [
  {
    path: 'security',
    children
  }
];

console.log(children);

export const AuthenticationComponents = [
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationModule {}
