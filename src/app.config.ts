import { APP_ID, ApplicationConfig, importProvidersFrom } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { provideRouter, TitleStrategy } from "@angular/router";
import { BawApiModule } from "@baw-api/baw-api.module";
import { ErrorModule } from "@components/error/error.module";
import { HomeModule } from "@components/home/home.module";
import { GuardModule } from "@guards/guards.module";
import { MenuModule } from "@menu/menu.module";
import { LOADING_BAR_CONFIG } from "@ngx-loading-bar/core";
import { ConfigModule } from "@services/config/config.module";
import { PageTitleStrategy } from "@services/page-title-strategy/page-title-strategy.service";
import { RehydrationModule } from "@services/rehydration/rehydration.module";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
import { CustomInputsModule } from "@shared/formly/custom-inputs.module";
import { DateValueAccessorModule } from "angular-date-value-accessor";
import { AppRoutingModule } from "./app/app-routing.module";
import { environment } from "./environments/environment";
import { routes } from "./app.routes";
import { appPageComponents } from "./app.pages";

export const appLibraryImports = [
  ReactiveFormsModule,
  CustomInputsModule,
  DateValueAccessorModule,
  MenuModule,
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...appPageComponents,
    provideRouter(routes),

    importProvidersFrom(
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
      HomeModule,
      ErrorModule
    ),

    { provide: TitleStrategy, useClass: PageTitleStrategy },
    // Show loading animation after 3 seconds
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 200 } },
    { provide: APP_ID, useValue: "workbench-client" },
  ],
};
