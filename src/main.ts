import { APP_ID, enableProdMode, importProvidersFrom } from "@angular/core";
import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { AboutModule } from "@components/about/about.module";
import { AdminModule } from "@components/admin/admin.module";
import { AnnotationModule } from "@components/annotations/annotation.module";
import { AnalysisModule } from "@components/audio-analysis/analysis-jobs.module";
import { AudioRecordingModule } from "@components/audio-recordings/audio-recording.module";
import { CitizenScienceModule } from "@components/citizen-science/citizen-science.module";
import { DataRequestModule } from "@components/data-request/data-request.module";
import { ErrorModule } from "@components/error/error.module";
import { HarvestModule } from "@components/harvest/harvest.module";
import { HomeModule } from "@components/home/home.module";
import { AnnotationsImportModule } from "@components/import-annotations/import-annotations.module";
import { LibraryModule } from "@components/library/library.module";
import { ListenModule } from "@components/listen/listen.module";
import { MyAccountModule, ProfileModule } from "@components/profile/profile.module";
import { ProjectsModule } from "@components/projects/projects.module";
import { RegionsModule } from "@components/regions/regions.module";
import { ReportProblemsModule } from "@components/report-problem/report-problem.module";
import { ReportsModule } from "@components/reports/reports.module";
import { ScriptsModule } from "@components/scripts/scripts.module";
import { SecurityModule } from "@components/security/security.module";
import { SendAudioModule } from "@components/send-audio/send-audio.module";
import { SitesModule } from "@components/sites/sites.module";
import { StatisticsModule } from "@components/statistics/statistics.module";
import { VisualizeModule } from "@components/visualize/visualize.module";
import { WebsiteStatusModule } from "@components/website-status/website-status.module";
import { MenuModule } from "@menu/menu.module";
import { CustomInputsModule } from "@shared/formly/custom-inputs.module";
import { DateValueAccessorModule } from "angular-date-value-accessor";
import { TitleStrategy } from "@angular/router";
import { BawApiModule } from "@baw-api/baw-api.module";
import { GuardModule } from "@guards/guards.module";
import { LOADING_BAR_CONFIG } from "@ngx-loading-bar/core";
import { ConfigModule } from "@services/config/config.module";
import { PageTitleStrategy } from "@services/page-title-strategy/page-title-strategy.service";
import { RehydrationModule } from "@services/rehydration/rehydration.module";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
import { environment } from "./environments/environment";
import { applyMonkeyPatches } from "./patches/patches";
import { AppComponent } from "./app/app.component";
import { AppRoutingModule } from "./app/app-routing.module";

applyMonkeyPatches();

if (environment.production) {
  enableProdMode();
}

// Await page load
const domContentLoadedPromise = new Promise<void>((resolve) =>
  document.addEventListener("DOMContentLoaded", () => {
    document.removeEventListener("DOMContentLoader", () => {});
    resolve();
  })
);

// Bootstrap Angular

export const appLibraryImports = [ReactiveFormsModule, CustomInputsModule];

export const appImports = [
  AboutModule,
  AdminModule,
  AnalysisModule,
  ScriptsModule,
  AudioRecordingModule,
  CitizenScienceModule,
  DataRequestModule,
  HarvestModule,
  ReportsModule,
  AnnotationModule,
  AnnotationsImportModule,
  LibraryModule,
  ListenModule,
  MyAccountModule,
  ProfileModule,
  ProjectsModule,
  RegionsModule,
  ReportProblemsModule,
  SecurityModule,
  SendAudioModule,
  SitesModule,
  StatisticsModule,
  WebsiteStatusModule,
  VisualizeModule,

  DateValueAccessorModule,
  MenuModule,

  // these last two must be last!
  HomeModule,
  ErrorModule,
];


domContentLoadedPromise.then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
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
        ...appImports
      ),

      { provide: TitleStrategy, useClass: PageTitleStrategy },
      // Show loading animation after 3 seconds
      { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 200 } },
      { provide: APP_ID, useValue: "workbench-client" },
    ],
  }).catch((err) => console.error(err));
});
