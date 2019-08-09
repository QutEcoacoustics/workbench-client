import { NgModule } from "@angular/core";
import { Router, RouterModule, Routes } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";

import { GetRoutesForPages } from "src/app/interfaces/page.interfaces";
import { securityCategory } from "./authentication";
import { ConfirmPasswordComponent } from "./pages/confirm-account/confirm-account.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { UnlockPasswordComponent } from "./pages/unlock-account/unlock-account.component";

export const AuthenticationComponents = [
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent,
  ConfirmPasswordComponent,
  UnlockPasswordComponent
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
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...AuthenticationComponents]
})
export class AuthenticationModule {}
