import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { resetRoutes } from './pages/reset-password/reset-password.component.menu';
import { registerRoutes } from './pages/register/register.component.menu';
import { loginRoutes } from './pages/login/login.component.menu';

let childrenRoutes: Routes = [];
childrenRoutes = childrenRoutes.concat(resetRoutes);
childrenRoutes = childrenRoutes.concat(registerRoutes);
childrenRoutes = childrenRoutes.concat(loginRoutes);

const routes: Routes = [
  {
    path: 'security',
    children: childrenRoutes
  }
];

console.log(childrenRoutes);

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
