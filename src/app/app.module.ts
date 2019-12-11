import { AgmCoreModule } from "@agm/core";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { providers } from "./app.helper";
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
import { FormlyFieldFileComponent } from "./helpers/formly/file-value.component";
import { FileValueAccessorDirective } from "./helpers/formly/file-value.directive";
import {
  FormlyCustomModule,
  formlyRoot,
  maxLengthValidationMessage,
  maxValidationMessage,
  minLengthValidationMessage,
  minValidationMessage
} from "./helpers/formly/formly.module";

@NgModule({
  declarations: [
    AppComponent,
    WidgetDirective,
    FormlyFieldFileComponent,
    FileValueAccessorDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyBootstrapModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: "required", message: "This field is required" },
        { name: "minlength", message: minLengthValidationMessage },
        { name: "maxlength", message: maxLengthValidationMessage },
        { name: "min", message: minValidationMessage },
        { name: "max", message: maxValidationMessage }
      ],
      types: [
        {
          name: "file",
          component: FormlyFieldFileComponent,
          wrappers: ["form-field"]
        }
      ]
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey
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
