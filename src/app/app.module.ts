import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BawApiModule } from "@baw-api/baw-api.module";
import { GuardModule } from "@guards/guards.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { AppConfigModule } from "@services/app-config/app-config.module";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { formlyRoot, toastrRoot } from "./app.helper";
import { AboutModule } from "./component/about/about.module";
import { AdminModule } from "./component/admin/admin.module";
import { DataRequestModule } from "./component/data-request/data-request.module";
import { ErrorModule } from "./component/error/error.module";
import { HomeModule } from "./component/home/home.module";
import {
  MyAccountModule,
  ProfileModule,
} from "./component/profile/profile.module";
import { ProjectsModule } from "./component/projects/projects.module";
import { ReportProblemsModule } from "./component/report-problem/report-problem.module";
import { SecurityModule } from "./component/security/security.module";
import { SendAudioModule } from "./component/send-audio/send-audio.module";
import { PermissionsShieldComponent } from "./component/shared/permissions-shield/permissions-shield.component";
import { SharedModule } from "./component/shared/shared.module";
import { SitesModule } from "./component/sites/sites.module";
import { StatisticsModule } from "./component/statistics/statistics.module";

export const appLibraryImports = [
  BrowserModule,
  BrowserAnimationsModule,
  NgbModule,
  ReactiveFormsModule,
  FormlyModule.forRoot(formlyRoot),
  FormlyBootstrapModule,
  ToastrModule.forRoot(toastrRoot),
];

export const appImports = [
  SharedModule,
  AboutModule,
  AdminModule,
  DataRequestModule,
  MyAccountModule,
  ProfileModule,
  ProjectsModule,
  ReportProblemsModule,
  SecurityModule,
  SendAudioModule,
  SitesModule,
  StatisticsModule,
  // these last two must be last!
  HomeModule,
  ErrorModule,
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: "workbench-client" }),
    AppRoutingModule,
    HttpClientModule,
    AppConfigModule,
    BawApiModule,
    GuardModule,
    ...appLibraryImports,
    ...appImports,
  ],
  bootstrap: [AppComponent],
  entryComponents: [PermissionsShieldComponent],
  exports: [],
})
export class AppModule {}
