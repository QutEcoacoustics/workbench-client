import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { BawPageModule } from "src/app/component/shared/BawPageModule";

import { GetRoutesForPages } from "src/app/interfaces/Page";
import { securityCategory } from "./authentication";
import { ConfirmPasswordComponent } from "./pages/confirm-account/confirm-account.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";

export const AuthenticationComponents = [
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent,
  ConfirmPasswordComponent
];

const authenticationRoute = securityCategory.route;
const routes: Routes = [
  {
    path: authenticationRoute as string,
    children: GetRoutesForPages(AuthenticationComponents)
  }
];

@NgModule({
  declarations: AuthenticationComponents,
  imports: [BawPageModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...AuthenticationComponents]
})
export class AuthenticationModule {}
