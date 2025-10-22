import { APP_ID, ApplicationConfig, importProvidersFrom, provideNgReflectAttributes } from "@angular/core";
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
import { CustomInputsModule } from "@shared/formly/custom-inputs.module";
import { DateValueAccessorModule } from "angular-date-value-accessor";
import { provideClientHydration } from "@angular/platform-browser";
import { provideBawApi } from "@baw-api/provide-baw-api";
import { providerTimeoutInterceptor } from "@services/timeout/provide-timeout";
import { environment } from "src/environments/environment";
import { appPageComponents } from "./app.pages";
import { clientRoutes } from "./app.routes";
import { defaultSlowLoadTime } from "./app.helper";

export const appLibraryImports = [
  ReactiveFormsModule,
  CustomInputsModule,
  DateValueAccessorModule,
];

export const appConfig: ApplicationConfig = {
  providers: [
    ...appPageComponents,
    provideRouter(
      clientRoutes,
      /*
        Initial navigation triggers resolvers before APP_INITIALIZER which
        means that the config has not been loaded. Disabling this fixes the
        problem. https://github.com/angular/angular/issues/14588
      */
      withDisabledInitialNavigation(),
      withInMemoryScrolling({
        scrollPositionRestoration: "enabled",
      }),
    ),

    importProvidersFrom(appLibraryImports),
    menuProviders,

    // This should only activate in dev & testing.
    // TODO: Migrate our tests to use property assertions instead of relying on
    // ng-reflect attributes.
    provideNgReflectAttributes(),

    provideConfig(),
    provideBawApi(),
    appLibraryImports,

    // Timeout API requests after set period
    providerTimeoutInterceptor({ timeout: environment.browserTimeout }),

    { provide: TitleStrategy, useClass: PageTitleStrategy },
    {
      provide: LOADING_BAR_CONFIG,
      useValue: { latencyThreshold: defaultSlowLoadTime },
    },
    { provide: APP_ID, useValue: "workbench-client" },

    provideClientHydration(),
  ],
};
