import { HttpClientModule } from "@angular/common/http";
import { DoBootstrap, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BawApiModule } from "@baw-api/baw-api.module";
import { RegionsModule } from "@components/regions/regions.module";
import { GuardModule } from "@guards/guards.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { AppConfigModule } from "@services/app-config/app-config.module";
import { ToastrModule } from "ngx-toastr";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { formlyRoot, toastrRoot } from "./app.helper";
import { AboutModule } from "./components/about/about.module";
import { AdminModule } from "./components/admin/admin.module";
import { DataRequestModule } from "./components/data-request/data-request.module";
import { ErrorModule } from "./components/error/error.module";
import { HomeModule } from "./components/home/home.module";
import {
  MyAccountModule,
  ProfileModule,
} from "./components/profile/profile.module";
import { ProjectsModule } from "./components/projects/projects.module";
import { ReportProblemsModule } from "./components/report-problem/report-problem.module";
import { SecurityModule } from "./components/security/security.module";
import { SendAudioModule } from "./components/send-audio/send-audio.module";
import { PermissionsShieldComponent } from "./components/shared/permissions-shield/permissions-shield.component";
import { SharedModule } from "./components/shared/shared.module";
import { SitesModule } from "./components/sites/sites.module";
import { StatisticsModule } from "./components/statistics/statistics.module";

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
  RegionsModule,
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
  entryComponents: [AppComponent, PermissionsShieldComponent],
  exports: [],
})
export class AppModule implements DoBootstrap {
  constructor() {}

  public ngDoBootstrap(app: any): void {
    app.bootstrap(AppComponent);
  }
}
