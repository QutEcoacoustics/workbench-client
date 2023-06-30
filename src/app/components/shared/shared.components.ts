import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { PipesModule } from "@pipes/pipes.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DateValueAccessorModule } from "angular-date-value-accessor";
import { NgxCaptchaModule } from "ngx-captcha";
import { ToastrModule } from "ngx-toastr";
import { DirectivesModule } from "src/app/directives/directives.module";
import { AnnotationDownloadComponent } from "./annotation-download/annotation-download.component";
import { BawClientModule } from "./baw-client/baw-client.module";
import { BreadcrumbModule } from "./breadcrumb/breadcrumb.module";
import { CheckboxModule } from "./checkbox/checkbox.module";
import { CmsComponent } from "./cms/cms.component";
import { DebounceInputComponent } from "./debounce-input/debounce-input.component";
import { DeleteModalComponent } from "./delete-modal/delete-modal.component";
import { DetailViewModule } from "./detail-view/detail-view.module";
import { ErrorHandlerComponent } from "./error-handler/error-handler.component";
import { FooterComponent } from "./footer/footer.component";
import { FormComponent } from "./form/form.component";
import { CustomInputsModule } from "./formly/custom-inputs.module";
import { HiddenCopyModule } from "./hidden-copy/hidden-copy.module";
import { IconsModule } from "./icons/icons.module";
import { IndicatorModule } from "./indicator/indicator.module";
import { InputModule } from "./input/input.module";
import { ItemsModule } from "./items/items.module";
import { LoadingModule } from "./loading/loading.module";
import { MenuModule } from "./menu/menu.module";
import { ModelCardsModule } from "./model-cards/model-cards.module";
import { ModelSelectorComponent } from "./model-selector/model-selector.component";
import { ProgressModule } from "./progress/progress.module";
import { StepperModule } from "./stepper/stepper.module";
import { UserLinkModule } from "./user-link/user-link.module";
import { WIPComponent } from "./wip/wip.component";
import { DateTimeFilterComponent } from "./date-time-filter/date-time-filter.component";
import { TypeaheadInputComponent } from "./typeahead-input/typeahead-input.component";
import { ChartComponent } from "./chart/chart.component";

export const sharedComponents = [
  AnnotationDownloadComponent,
  CmsComponent,
  DebounceInputComponent,
  ErrorHandlerComponent,
  FooterComponent,
  FormComponent,
  WIPComponent,
  ModelSelectorComponent,
  DeleteModalComponent,
  DateTimeFilterComponent,
  TypeaheadInputComponent,
  ChartComponent,
];

export const internalComponents = [];

export const sharedModules = [
  BrowserAnimationsModule,
  CommonModule,
  DateValueAccessorModule,
  FontAwesomeModule,
  FormlyBootstrapModule,
  FormlyModule,
  FormsModule,
  LoadingBarHttpClientModule,
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbTypeaheadModule,
  NgxDatatableModule,
  ReactiveFormsModule,
  RouterModule,
  ToastrModule,

  BawClientModule,
  BreadcrumbModule,
  CheckboxModule,
  CustomInputsModule,
  DetailViewModule,
  DirectivesModule,
  HiddenCopyModule,
  IconsModule,
  IndicatorModule,
  InputModule,
  ItemsModule,
  LoadingModule,
  MenuModule,
  ModelCardsModule,
  PipesModule,
  ProgressModule,
  StepperModule,
  UserLinkModule,
];

export const internalModules = [...sharedModules, NgxCaptchaModule];
