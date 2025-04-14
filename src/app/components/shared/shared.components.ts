import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { DateValueAccessorModule } from "angular-date-value-accessor";
import { NgxCaptchaModule } from "ngx-captcha";
import { ConfirmationComponent } from "@components/harvest/components/modal/confirmation.component";
import { WebsiteStatusWarningComponent } from "@menu/website-status-warning/website-status-warning.component";
import { AnnotationDownloadComponent } from "./annotation-download/annotation-download.component";
import { CmsComponent } from "./cms/cms.component";
import { DebounceInputComponent } from "./debounce-input/debounce-input.component";
import { DeleteModalComponent } from "./delete-modal/delete-modal.component";
import { ErrorHandlerComponent } from "./error-handler/error-handler.component";
import { FooterComponent } from "./footer/footer.component";
import { FormComponent } from "./form/form.component";
import { CustomInputsModule } from "./formly/custom-inputs.module";
import { IconsModule } from "./icons/icons.module";
import { MenuModule } from "./menu/menu.module";
import { ModelSelectorComponent } from "./model-selector/model-selector.component";
import { WIPComponent } from "./wip/wip.component";
import { DateTimeFilterComponent } from "./date-time-filter/date-time-filter.component";
import { TypeaheadInputComponent } from "./typeahead-input/typeahead-input.component";
import { ChartComponent } from "./chart/chart.component";
import { InlineListComponent } from "./inline-list/inline-list.component";
import { TimeSinceComponent } from "./datetime-formats/time-since/time-since.component";
import { DurationComponent } from "./datetime-formats/duration/duration.component";
import { ZonedDateTimeComponent } from "./datetime-formats/datetime/zoned-datetime/zoned-datetime.component";
import { DatetimeComponent } from "./datetime-formats/datetime/datetime/datetime.component";
import { IfLoggedInComponent } from "./can/can.component";
import { ErrorCardComponent } from "./error-card/error-card.component";
import { ToastComponent } from "./toast/toast.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { UserLinkComponent } from "./user-link/user-link.component";
import { StepperComponent } from "./stepper/stepper.component";
import { ProgressComponent } from "./progress/progress/progress.component";
import { ProgressBarComponent } from "./progress/bar/bar.component";
import { AnnotationEventCardComponent } from "./audio-event-card/annotation-event-card.component";
import { CardsComponent } from "./model-cards/cards/cards.component";
import { TimeComponent } from "./input/time/time.component";
import { IndicatorComponent } from "./indicator/indicator.component";
import { HiddenCopyComponent } from "./hidden-copy/hidden-copy.component";
import { RenderFieldComponent } from "./detail-view/render-field/render-field.component";
import { DetailViewComponent } from "./detail-view/detail-view.component";

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
  InlineListComponent,
  WebsiteStatusWarningComponent,
  IfLoggedInComponent,
  ErrorCardComponent,

  // modals
  ConfirmationComponent,
];

export const internalComponents = [];

export const sharedModules = [
  BrowserAnimationsModule,
  DateValueAccessorModule,
  FormlyBootstrapModule,
  FormlyModule,
  FormsModule,
  NgxDatatableModule,
  ReactiveFormsModule,
  RouterModule,
  BreadcrumbComponent,
  UserLinkComponent,
  StepperComponent,
  ProgressComponent,
  ProgressBarComponent,
  AnnotationEventCardComponent,
  CardsComponent,
  MenuModule,
  TimeComponent,
  IndicatorComponent,
  IconsModule,
  HiddenCopyComponent,
  RenderFieldComponent,
  DetailViewComponent,
  CustomInputsModule,

  TimeSinceComponent,
  DurationComponent,
  ZonedDateTimeComponent,
  DatetimeComponent,
  ToastComponent,
];

export const internalModules = [...sharedModules, NgxCaptchaModule];
