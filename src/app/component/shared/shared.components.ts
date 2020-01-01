import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { ActionMenuComponent } from "./action-menu/action-menu.component";
import { CardsModule } from "./cards/cards.module";
import { CmsComponent } from "./cms/cms.component";
import { ErrorHandlerComponent } from "./error-handler/error-handler.component";
import { FooterComponent } from "./footer/footer.component";
import { FormComponent } from "./form/form.component";
import { HeaderModule } from "./header/header.module";
import { ItemsModule } from "./items/items.module";
import { MenuModule } from "./menu/menu.module";
import { SecondaryMenuComponent } from "./secondary-menu/secondary-menu.component";
import { WIPComponent } from "./wip/wip.component";

export const sharedComponents = [
  FooterComponent,
  ActionMenuComponent,
  SecondaryMenuComponent,
  FormComponent,
  ErrorHandlerComponent,
  WIPComponent,
  CmsComponent
];

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
  MatProgressSpinnerModule,

  CardsModule,
  HeaderModule,
  ItemsModule,
  MenuModule
];
