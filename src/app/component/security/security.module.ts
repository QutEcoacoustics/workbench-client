import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "src/app/component/shared/shared.module";
import { GetRouteConfigForPage } from "src/app/interfaces/pageRouting";
import { ConfirmPasswordComponent } from "./pages/confirm-account/confirm-account.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { UnlockPasswordComponent } from "./pages/unlock-account/unlock-account.component";
import { securityRoute } from "./security.menus";

export const SecurityComponents = [
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent,
  ConfirmPasswordComponent,
  UnlockPasswordComponent
];

const routes = securityRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: SecurityComponents,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...SecurityComponents]
})
export class SecurityModule {}
