import { AgmCoreModule } from "@agm/core";
import { AgmSnazzyInfoWindowModule } from "@agm/snazzy-info-window";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";
import { CardsModule } from "./cards/cards.module";
import { HeaderModule } from "./header/header.module";
import { MenuModule } from "./menu/menu.module";
import { sharedComponents } from "./shared.components";

@NgModule({
  declarations: [...sharedComponents],
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    AgmCoreModule,
    AgmSnazzyInfoWindowModule,
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
    MenuModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    AgmCoreModule,
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
    MenuModule,
    sharedComponents
  ]
})
export class SharedModule {
  constructor() {
    library.add(fas);
  }
}
