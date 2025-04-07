import {
  APP_ID,
  ApplicationRef,
  DoBootstrap,
  NgModule,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BawApiModule } from "@baw-api/baw-api.module";
import { AudioRecordingModule } from "@components/audio-recordings/audio-recording.module";
import { ReportsModule } from "@components/reports/reports.module";
import { CitizenScienceModule } from "@components/citizen-science/citizen-science.module";
import { HarvestModule } from "@components/harvest/harvest.module";
import { LibraryModule } from "@components/library/library.module";
import { RegionsModule } from "@components/regions/regions.module";
import { VisualizeModule } from "@components/visualize/visualize.module";
import { GuardModule } from "@guards/guards.module";
import { FormlyBootstrapModule } from "@ngx-formly/bootstrap";
import { FormlyModule } from "@ngx-formly/core";
import { LOADING_BAR_CONFIG } from "@ngx-loading-bar/core";
import { ConfigModule } from "@services/config/config.module";
import { RehydrationModule } from "@services/rehydration/rehydration.module";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
import { formlyConfig } from "@shared/formly/custom-inputs.module";
import { environment } from "src/environments/environment";
import { TitleStrategy } from "@angular/router";
import { AnnotationsImportModule } from "@components/import-annotations/import-annotations.module";
import { WebsiteStatusModule } from "@components/website-status/website-status.module";
import { AnnotationModule } from "@components/annotations/annotation.module";
import { ScriptsModule } from "@components/scripts/scripts.module";
import { AnalysisModule } from "@components/audio-analysis/analysis-jobs.module";
import { ToastProviderComponent } from "@shared/toast-provider/toast-provider.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent, PageTitleStrategy } from "./app.component";
import { AboutModule } from "./components/about/about.module";
import { AdminModule } from "./components/admin/admin.module";
import { DataRequestModule } from "./components/data-request/data-request.module";
import { ErrorModule } from "./components/error/error.module";
import { HomeModule } from "./components/home/home.module";
import { ListenModule } from "./components/listen/listen.module";
import {
  MyAccountModule,
  ProfileModule,
} from "./components/profile/profile.module";
import { ProjectsModule } from "./components/projects/projects.module";
import { ReportProblemsModule } from "./components/report-problem/report-problem.module";
import { SecurityModule } from "./components/security/security.module";
import { SendAudioModule } from "./components/send-audio/send-audio.module";
import { SharedModule } from "./components/shared/shared.module";
import { SitesModule } from "./components/sites/sites.module";
import { StatisticsModule } from "./components/statistics/statistics.module";

export const appLibraryImports = [
  BrowserModule,
  BrowserAnimationsModule,
  ReactiveFormsModule,
  FormlyModule.forRoot(formlyConfig),
  FormlyBootstrapModule,
];

export const appImports = [
  SharedModule,
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

  // standalone components
  ToastProviderComponent,

  // these last two must be last!
  HomeModule,
  ErrorModule,
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    // Timeout API requests after set period
    BawTimeoutModule.forRoot({ timeout: environment.browserTimeout }),
    AppRoutingModule,
    ConfigModule,
    BawApiModule,
    // Rehydrate data from SSR. This must be set after BawApiModule so that the
    // interceptor runs after the API interceptor
    RehydrationModule,
    GuardModule,
    ...appLibraryImports,
    ...appImports,
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
