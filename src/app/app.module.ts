import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";

import { AppRoutingModule } from "./app-routing.module";
import { AuthenticationModule } from "./component/authentication/authentication.module";
import { HomeModule } from "./component/home/home.module";
import { PageNotFoundModule } from "./component/shared/PageNotFoundModule";
import { SharedModule } from "./component/shared/shared.module";

import { BawApiService } from "./services/baw-api/baw-api.service";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./component/home/home.component";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: "required", message: "This field is required" },
        { name: "minlength", message: minLengthValidationMessage },
        { name: "maxlength", message: maxLengthValidationMessage },
        { name: "min", message: minValidationMessage },
        { name: "max", message: maxValidationMessage }
      ]
    }),
    FormlyBootstrapModule,
    LoadingBarHttpClientModule,
    SharedModule,
    HomeModule,
    AuthenticationModule,
    PageNotFoundModule
  ],
  providers: [BawApiService],
  bootstrap: [AppComponent],
  exports: [HomeComponent]
})
export class AppModule {
  constructor() {
    library.add(fas);
  }
}

export function minLengthValidationMessage(err, field) {
  return `Input should have at least ${
    field.templateOptions.minLength
  } characters`;
}

export function maxLengthValidationMessage(err, field) {
  return `This value should be less than ${
    field.templateOptions.maxLength
  } characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}
