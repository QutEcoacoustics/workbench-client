import { APP_ID, ApplicationConfig, importProvidersFrom } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import {
  provideRouter,
  TitleStrategy,
  withDisabledInitialNavigation,
  withInMemoryScrolling,
} from "@angular/router";
import { menuProviders } from "@menu/provide-menu";
import { LOADING_BAR_CONFIG } from "@ngx-loading-bar/core";
import { provideConfig } from "@services/config/provide-config";
import { PageTitleStrategy } from "@services/page-title-strategy/page-title-strategy.service";
import { providerTimeoutInterceptor } from "@services/timeout/provide-timeout";
import { CustomInputsModule } from "@shared/formly/custom-inputs.module";
import { DateValueAccessorModule } from "angular-date-value-accessor";
import { RehydrationInterceptorService } from "@services/rehydration/rehydration.interceptor.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { provideBawApi } from "@baw-api/provide-baw-api";
import { environment } from "../environments/environment";
import { appPageComponents } from "./app.pages";
import { routes } from "./app.routes";

export const appLibraryImports = [
  ReactiveFormsModule,
  CustomInputsModule,
  DateValueAccessorModule,
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...appPageComponents,
    provideRouter(
      routes,
      /*
        Initial navigation triggers resolvers before APP_INITIALIZER which
        means that the config has not been loaded. Disabling this fixes the
        problem. https://github.com/angular/angular/issues/14588
      */
      withDisabledInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled",
      })
    ),

    importProvidersFrom(appLibraryImports),
    menuProviders,

    provideBawApi(),
    appLibraryImports,

    provideConfig(),

    // Timeout API requests after set period
    providerTimeoutInterceptor({ timeout: environment.browserTimeout }),

    { provide: TitleStrategy, useClass: PageTitleStrategy },
    // Show loading animation after 3 seconds
    { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 200 } },
    { provide: APP_ID, useValue: "workbench-client" },

    // Rehydrate data from SSR. This must be set after BawApi imports so that
    // the interceptor runs after the API interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RehydrationInterceptorService,
      multi: true,
    },
  ],
};
