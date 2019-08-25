import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { validationMessages } from "./app.helper";
import { AboutModule } from "./component/about/about.module";
import { DataRequestModule } from "./component/data-request/data-request.module";
import { ErrorModule } from "./component/error/error.module";
import { HomeModule } from "./component/home/home.module";
import { ProjectsModule } from "./component/projects/projects.module";
import { ReportProblemsModule } from "./component/report-problem/report-problem.module";
import { SecurityModule } from "./component/security/security.module";
import { PermissionsShieldComponent } from "./component/shared/permissions-shield/permissions-shield.component";
import { SharedModule } from "./component/shared/shared.module";
import { WidgetDirective } from "./component/shared/widget/widget.directive";
import { SitesModule } from "./component/sites/sites.module";
import { StatisticsModule } from "./component/statistics/statistics.module";
import { BawApiInterceptor } from "./services/baw-api/base-api.interceptor";

@NgModule({
  declarations: [AppComponent, WidgetDirective],
  imports: [
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormlyModule.forRoot({
      validationMessages
    }),
    FormlyBootstrapModule,
    LoadingBarHttpClientModule,
    SharedModule,
    SecurityModule,
    AboutModule,
    ProjectsModule,
    SitesModule,
    ReportProblemsModule,
    DataRequestModule,
    StatisticsModule,
    // these last two must be last!
    HomeModule,
    ErrorModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BawApiInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [PermissionsShieldComponent],
  exports: []
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}
