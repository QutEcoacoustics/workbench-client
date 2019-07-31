import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import {
  resetRoutes,
  ResetPasswordComponent
} from './pages/reset-password/reset-password.component';
import {
  registerRoutes,
  RegisterComponent
} from './pages/register/register.component';
import { loginRoutes, LoginComponent } from './pages/login/login.component';
import { SecondaryMenuComponent } from '../shared/secondary-menu/secondary-menu.component';

let childrenRoutes: Routes = [];
childrenRoutes = childrenRoutes.concat(resetRoutes);
childrenRoutes = childrenRoutes.concat(registerRoutes);
childrenRoutes = childrenRoutes.concat(loginRoutes);

const secondaryRoutes: Routes = childrenRoutes.map(route => {
  return {
    path: route.path,
    pathMatch: 'full',
    component: SecondaryMenuComponent,
    data: route.data
  };
});

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
