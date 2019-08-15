import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { AppRoutingModule } from "src/app/app-routing.module";
import { CardsModule } from "./cards/cards.modules";
import { sharedComponents } from "./shared.components";

@NgModule({
  declarations: [sharedComponents],
  imports: [
    CommonModule,
    AppRoutingModule,
    LoadingBarHttpClientModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    CardsModule
  ],
  exports: [
    CommonModule,
    AppRoutingModule,
    LoadingBarHttpClientModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    CardsModule,
    sharedComponents
  ]
})
export class SharedModule {}
