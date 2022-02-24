import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  NgbPaginationModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { PipesModule } from "@pipes/pipes.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DateValueAccessorModule } from "angular-date-value-accessor";
import { NgxCaptchaModule } from "ngx-captcha";
import { ClipboardModule } from "ngx-clipboard";
import { ToastrModule } from "ngx-toastr";
import { DirectivesModule } from "src/app/directives/directives.module";
import { AnnotationDownloadComponent } from "./annotation-download/annotation-download.component";
import { BawClientModule } from "./baw-client/baw-client.module";
import { BreadcrumbModule } from "./breadcrumb/breadcrumb.module";
import { ModelCardsModule } from "./model-cards/model-cards.module";
import { CheckboxModule } from "./checkbox/checkbox.module";
import { CmsComponent } from "./cms/cms.component";
import { DebounceInputComponent } from "./debounce-input/debounce-input.component";
import { DetailViewModule } from "./detail-view/detail-view.module";
import { ErrorHandlerComponent } from "./error-handler/error-handler.component";
import { FooterComponent } from "./footer/footer.component";
import { FormComponent } from "./form/form.component";
import { CustomInputsModule } from "./formly/custom-inputs.module";
import { IconsModule } from "./icons/icons.module";
import { IndicatorModule } from "./indicator/indicator.module";
import { ItemsModule } from "./items/items.module";
import { LoadingModule } from "./loading/loading.module";
import { MenuModule } from "./menu/menu.module";
import { UserLinkModule } from "./user-link/user-link.module";
import { WIPComponent } from "./wip/wip.component";

export const sharedComponents = [
  AnnotationDownloadComponent,
  CmsComponent,
  DebounceInputComponent,
  ErrorHandlerComponent,
  FooterComponent,
  FormComponent,
  WIPComponent,
];

export const internalComponents = [];

export const sharedModules = [
  CommonModule,
  RouterModule,
  BrowserAnimationsModule,
  LoadingBarHttpClientModule,
  NgbTooltipModule,
  NgbPaginationModule,
  NgbProgressbarModule,
  FontAwesomeModule,
  FormsModule,
  ReactiveFormsModule,
  FormlyModule,
  FormlyBootstrapModule,
  NgxDatatableModule,
  ToastrModule,
  ClipboardModule,
  DateValueAccessorModule,

  IconsModule,
  DirectivesModule,
  PipesModule,
  BawClientModule,
  CustomInputsModule,
  ModelCardsModule,
  ItemsModule,
  MenuModule,
  LoadingModule,
  IndicatorModule,
  UserLinkModule,
  CheckboxModule,
  DetailViewModule,
  BreadcrumbModule,
];

export const internalModules = [...sharedModules, NgxCaptchaModule];
