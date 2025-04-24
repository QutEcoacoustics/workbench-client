import { APP_ID, ApplicationRef, DoBootstrap, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BawApiModule } from "@baw-api/baw-api.module";
import { GuardModule } from "@guards/guards.module";
import { LOADING_BAR_CONFIG } from "@ngx-loading-bar/core";
import { ConfigModule } from "@services/config/config.module";
import { RehydrationModule } from "@services/rehydration/rehydration.module";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
import { environment } from "src/environments/environment";
import { TitleStrategy } from "@angular/router";
import { DateValueAccessorModule } from "angular-date-value-accessor";
import { MenuModule } from "@menu/menu.module";
import { CustomInputsModule } from "@shared/formly/custom-inputs.module";
import { BrowserModule } from "@angular/platform-browser";
import { PageTitleStrategy } from "@services/page-title-strategy/page-title-strategy.service";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ErrorModule } from "./components/error/error.module";
import { HomeModule } from "./components/home/home.module";

export const appLibraryImports = [ReactiveFormsModule, CustomInputsModule];

export const appImports = [
  DateValueAccessorModule,
  MenuModule,

  // these last two must be last!
  HomeModule,
  ErrorModule,
];

@NgModule({
  imports: [
    // Timeout API requests after set period
    BawTimeoutModule.forRoot({ timeout: environment.browserTimeout }),
    BrowserModule,
    AppRoutingModule,
    ConfigModule,
    BawApiModule,
    // Rehydrate data from SSR. This must be set after BawApiModule so that the
    // interceptor runs after the API interceptor
    RehydrationModule,
    GuardModule,
    ...appLibraryImports,
    ...appImports,
    AppComponent,
  ],
  providers: [
    { provide: TitleStrategy, useClass: PageTitleStrategy },
    // Show loading animation after 3 seconds
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 200 } },
    { provide: APP_ID, useValue: "workbench-client" },
  ],
  exports: [],
})
export class AppModule implements DoBootstrap {
  public ngDoBootstrap(app: ApplicationRef): void {
    app.bootstrap(AppComponent);
  }
}
