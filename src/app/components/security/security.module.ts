import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { GetRouteConfigForPage } from "@helpers/page/pageRouting";
import { SharedModule } from "@shared/shared.module";
import { ConfirmPasswordComponent } from "./pages/confirm-account/confirm-account.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { UnlockAccountComponent } from "./pages/unlock-account/unlock-account.component";
import { securityRoute } from "./security.menus";

const components = [
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent,
  ConfirmPasswordComponent,
  UnlockAccountComponent,
];

const routes = securityRoute.compileRoutes(GetRouteConfigForPage);

@NgModule({
  declarations: components,
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule, ...components],
})
export class SecurityModule {}
