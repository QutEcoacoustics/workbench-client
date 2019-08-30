import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FormlyModule } from "@ngx-formly/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { providers, validationMessages } from "./app.helper";
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

@NgModule({
  declarations: [AppComponent, WidgetDirective],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormlyModule.forRoot({
      validationMessages
    }),
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
  providers: [...providers],
  bootstrap: [AppComponent],
  entryComponents: [PermissionsShieldComponent],
  exports: []
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}
