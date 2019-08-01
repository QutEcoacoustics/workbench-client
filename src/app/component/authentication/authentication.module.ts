import { RouterModule, Routes, Route } from '@angular/router';
import { NgModule } from '@angular/core';

import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { resetPasswordRoutes } from './pages/reset-password/reset-password.component.menu';
import { registerRoutes } from './pages/register/register.component.menu';
import { loginRoutes } from './pages/login/login.component.menu';

const authenticationRoute = 'security';

let childrenRoutes: Routes = [];
childrenRoutes = childrenRoutes.concat(resetPasswordRoutes);
childrenRoutes = childrenRoutes.concat(registerRoutes);
childrenRoutes = childrenRoutes.concat(loginRoutes);

const routes: Routes = [
  {
    path: authenticationRoute,
    children: childrenRoutes
  }
];

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
