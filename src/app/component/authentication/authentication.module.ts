import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BawPageModule as BawPageModule } from "src/app/component/shared/BawPageModule";



import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { RegisterComponent } from "./pages/register/register.component";
import { LoginComponent } from "./pages/login/login.component";
import { GetRoutesForPages } from "src/app/interfaces/Page";

const authenticationRoute = "security";

export const AuthenticationComponents = [
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent
];

const routes: Routes = [
  {
    path: authenticationRoute,
    children: GetRoutesForPages(AuthenticationComponents)
  }
];



@NgModule({
  declarations: AuthenticationComponents,
  imports: [
    BawPageModule,
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule, ...AuthenticationComponents]
})
export class AuthenticationModule { }
