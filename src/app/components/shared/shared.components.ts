import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { PipesModule } from "@pipes/pipes.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { NgxCaptchaModule } from "ngx-captcha";
import { LineTruncationLibModule } from "ngx-line-truncation";
import { ToastrModule } from "ngx-toastr";
import { DirectivesModule } from "src/app/directives/directives.module";
import { ActionMenuComponent } from "./action-menu/action-menu.component";
import { BawClientModule } from "./baw-client/baw-client.module";
import { CardsModule } from "./cards/cards.module";
import { CheckboxComponent } from "./checkbox/checkbox.component";
import { CmsComponent } from "./cms/cms.component";
import { DebounceInputComponent } from "./debounce-input/debounce-input.component";
import { DetailViewComponent } from "./detail-view/detail-view.component";
import { RenderFieldComponent } from "./detail-view/render-field/render-field.component";
import { ErrorHandlerComponent } from "./error-handler/error-handler.component";
import { FooterComponent } from "./footer/footer.component";
import { FormComponent } from "./form/form.component";
import { CustomInputsModule } from "./formly/custom-inputs.module";
import { HeaderModule } from "./header/header.module";
import { IconsModule } from "./icons/icons.module";
import { IndicatorModule } from "./indicator/indicator.module";
import { ItemsModule } from "./items/items.module";
import { LoadingModule } from "./loading/loading.module";
import { MenuModule } from "./menu/menu.module";
import { SecondaryMenuComponent } from "./secondary-menu/secondary-menu.component";
import { WIPComponent } from "./wip/wip.component";

export const sharedComponents = [
  ActionMenuComponent,
  CheckboxComponent,
  CmsComponent,
  DebounceInputComponent,
  DetailViewComponent,
  ErrorHandlerComponent,
  FooterComponent,
  FormComponent,
  SecondaryMenuComponent,
  WIPComponent,
];

export const internalComponents = [...sharedComponents, RenderFieldComponent];

export const sharedModules = [
  CommonModule,
  RouterModule,
  BrowserAnimationsModule,
  LoadingBarHttpClientModule,
  NgbModule,
  FontAwesomeModule,
  FormsModule,
  ReactiveFormsModule,
  FormlyModule,
  FormlyBootstrapModule,
  NgxDatatableModule,
  ToastrModule,

  IconsModule,
  DirectivesModule,
  PipesModule,
  BawClientModule,
  CustomInputsModule,
  CardsModule,
  HeaderModule,
  ItemsModule,
  MenuModule,
  LoadingModule,
  IndicatorModule,
];

export const internalModules = [
  ...sharedModules,
  LineTruncationLibModule,
  NgxCaptchaModule,
];
