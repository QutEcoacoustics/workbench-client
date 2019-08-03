import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app-routing.module";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { FormlyModule } from "@ngx-formly/core";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";

import { BawApiService } from "./services/baw-api/baw-api.service";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./component/home/home.component";
import { sharedComponents } from "./component/shared/shared.components";

import { AuthenticationModule } from "./component/authentication/authentication.module";
import { HomeModule } from "./component/home/home.module";
import { CardsModule } from "./component/shared/cards/cards.modules";

@NgModule({
  declarations: [AppComponent, sharedComponents],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormlyModule.forRoot({
      types: []
    }),
    FormlyBootstrapModule,
    CardsModule,
    HomeModule,
    AuthenticationModule
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
