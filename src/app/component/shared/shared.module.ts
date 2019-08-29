import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { CardsModule } from "./cards/cards.modules";
import { HeaderModule } from "./header/header.module";
import { sharedComponents } from "./shared.components";
import { WidgetDirective } from "./widget/widget.directive";

@NgModule({
  declarations: [...sharedComponents, WidgetDirective],
  imports: [
    CommonModule,
    RouterModule,
    LoadingBarHttpClientModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    CardsModule,
    HeaderModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    LoadingBarHttpClientModule,
    NgbModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    CardsModule,
    HeaderModule,
    sharedComponents
  ]
})
export class SharedModule {}
