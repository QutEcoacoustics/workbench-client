import { APP_ID, ApplicationConfig, importProvidersFrom } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {
  provideRouter,
  TitleStrategy,
  withInMemoryScrolling,
} from "@angular/router";
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
import { appPageComponents } from "./app.pages";
import { routes } from "./app.routes";
import { environment } from "./environments/environment";

export const appLibraryImports = [
  ReactiveFormsModule,
  CustomInputsModule,
  DateValueAccessorModule,
  MenuModule,
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...appPageComponents,
    provideRouter(
      routes,
      withInMemoryScrolling({
        /*
         * Initial navigation triggers resolvers before APP_INITIALIZER which
         * means that the config has not been loaded. Disabling this fixes the
         * problem. https://github.com/angular/angular/issues/14588
         */
        // initialNavigation: "disabled",
        scrollPositionRestoration: "enabled",
      })
    ),

    importProvidersFrom(
      // Timeout API requests after set period
      BawTimeoutModule.forRoot({ timeout: environment.browserTimeout }),
      BrowserModule,
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
