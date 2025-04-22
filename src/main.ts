import { APP_ID, enableProdMode, importProvidersFrom } from "@angular/core";
import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { ErrorModule } from "@components/error/error.module";
import { HomeModule } from "@components/home/home.module";
import { MenuModule } from "@menu/menu.module";
import { CustomInputsModule } from "@shared/formly/custom-inputs.module";
import { DateValueAccessorModule } from "angular-date-value-accessor";
import { provideRouter, TitleStrategy } from "@angular/router";
import { BawApiModule } from "@baw-api/baw-api.module";
import { GuardModule } from "@guards/guards.module";
import { LOADING_BAR_CONFIG } from "@ngx-loading-bar/core";
import { ConfigModule } from "@services/config/config.module";
import { PageTitleStrategy } from "@services/page-title-strategy/page-title-strategy.service";
import { RehydrationModule } from "@services/rehydration/rehydration.module";
import { BawTimeoutModule } from "@services/timeout/timeout.module";
import { getRouteConfigForPage } from "@helpers/page/pageRouting";
import { aboutRoute } from "@components/about/about.menus";
import { ContactUsComponent } from "@components/about/pages/contact-us/contact-us.component";
import { CreditsComponent } from "@components/about/pages/credits/credits.component";
import { DataSharingPolicyComponent } from "@components/about/pages/data-sharing-policy/data-sharing-policy.component";
import { DisclaimersComponent } from "@components/about/pages/disclaimers/disclaimers.component";
import { EthicsComponent } from "@components/about/pages/ethics/ethics.component";
import { AdminDashboardComponent } from "@components/admin/dashboard/dashboard.component";
import { AllUploadsComponent } from "@components/admin/all-uploads/all-uploads.component";
import { DateTimeExampleComponent } from "@components/admin/datetime-example/datetime-example.component";
import { AdminThemeTemplateComponent } from "@components/admin/theme-template/theme-template.component";
import { AdminUserListComponent } from "@components/admin/users/user.component";
import { adminRoute } from "@components/admin/admin.menus";
import { analysesRoute } from "@components/audio-analysis/analysis-jobs.routes";
import { AnalysisJobComponent } from "@components/audio-analysis/pages/details/details.component";
import { AnalysesComponent } from "@components/audio-analysis/pages/list/list.component";
import { AdminScriptComponent } from "@components/scripts/details/details.component";
import { AdminScriptsEditComponent } from "@components/scripts/edit/edit.component";
import { AdminScriptsComponent } from "@components/scripts/list/list.component";
import { AdminScriptsNewComponent } from "@components/scripts/new/new.component";
import { scriptsRoute } from "@components/scripts/scripts.routes";
import { AudioRecordingsDetailsComponent } from "@components/audio-recordings/pages/details/details.component";
import { DownloadAudioRecordingsComponent } from "@components/audio-recordings/pages/download/download.component";
import { AudioRecordingsListComponent } from "@components/audio-recordings/pages/list/list.component";
import { audioRecordingsRoutes } from "@components/audio-recordings/audio-recording.routes";
import { CitSciAboutComponent } from "@components/citizen-science/pages/about/about.component";
import { CitSciListenItemComponent } from "@components/citizen-science/pages/listen-item/listen-item.component";
import { CitSciListenComponent } from "@components/citizen-science/pages/listen/listen.component";
import { CitSciResponsesComponent } from "@components/citizen-science/pages/responses/responses.component";
import { citSciRoute } from "@components/citizen-science/citizen-science.menus";
import { DataRequestComponent } from "@components/data-request/data-request.component";
import { dataRequestRoute } from "@components/data-request/data-request.menus";
import { HarvestDetailsComponent } from "@components/harvest/pages/details/details.component";
import { HarvestListComponent } from "@components/harvest/pages/list/list.component";
import { HarvestNewComponent } from "@components/harvest/pages/new/new.component";
import { harvestsRoute } from "@components/harvest/harvest.routes";
import { reportsRoute } from "@components/reports/reports.routes";
import { NewEventReportComponent } from "@components/reports/pages/event-summary/new/new.component";
import { ViewEventReportComponent } from "@components/reports/pages/event-summary/view/view.component";
import { VerificationComponent } from "@components/annotations/pages/verification/verification.component";
import { AnnotationSearchComponent } from "@components/annotations/pages/search/search.component";
import { verificationRoute } from "@components/annotations/annotation.routes";
import { AnnotationImportDetailsComponent } from "@components/import-annotations/details/details.component";
import { AnnotationsListComponent } from "@components/import-annotations/list/list.component";
import { NewAnnotationsComponent } from "@components/import-annotations/new/new.component";
import { EditAnnotationsComponent } from "@components/import-annotations/edit/edit.component";
import { AddAnnotationsComponent } from "@components/import-annotations/add-annotations/add-annotations.component";
import { annotationsImportRoute } from "@components/import-annotations/import-annotations.routes";
import { AnnotationComponent } from "@components/library/pages/details/details.component";
import { LibraryComponent } from "@components/library/pages/list/list.component";
import { libraryRoute } from "@components/library/library.menus";
import { ListenComponent } from "@components/listen/pages/list/list.component";
import { ListenRecordingComponent } from "@components/listen/pages/details/details.component";
import { listenRoute } from "@components/listen/listen.menus";
import { MyAnnotationsComponent } from "@components/profile/pages/annotations/my-annotations.component";
import { MyBookmarksComponent } from "@components/profile/pages/bookmarks/my-bookmarks.component";
import { MyEditComponent } from "@components/profile/pages/my-edit/my-edit.component";
import { MyPasswordComponent } from "@components/profile/pages/my-password/my-password.component";
import { MyProfileComponent } from "@components/profile/pages/profile/my-profile.component";
import { MyProjectsComponent } from "@components/profile/pages/projects/my-projects.component";
import { MySitesComponent } from "@components/profile/pages/sites/my-sites.component";
import { TheirAnnotationsComponent } from "@components/profile/pages/annotations/their-annotations.component";
import { TheirBookmarksComponent } from "@components/profile/pages/bookmarks/their-bookmarks.component";
import { TheirProfileComponent } from "@components/profile/pages/profile/their-profile.component";
import { TheirProjectsComponent } from "@components/profile/pages/projects/their-projects.component";
import { TheirSitesComponent } from "@components/profile/pages/sites/their-sites.component";
import { TheirEditComponent } from "@components/profile/pages/their-edit/their-edit.component";
import { myAccountRoute, theirProfileRoute } from "@components/profile/profile.menus";
import { AssignComponent } from "@components/projects/pages/assign/assign.component";
import { ProjectDetailsComponent } from "@components/projects/pages/details/details.component";
import { ProjectEditComponent } from "@components/projects/pages/edit/edit.component";
import { ProjectListComponent } from "@components/projects/pages/list/list.component";
import { ProjectNewComponent } from "@components/projects/pages/new/new.component";
import { PermissionsComponent } from "@components/projects/pages/permissions/permissions.component";
import { RequestComponent } from "@components/projects/pages/request/request.component";
import { projectsRoute } from "@components/projects/projects.routes";
import { RegionDetailsComponent } from "@components/regions/pages/details/details.component";
import { RegionEditComponent } from "@components/regions/pages/edit/edit.component";
import { RegionListComponent } from "@components/regions/pages/list/list.component";
import { RegionNewComponent } from "@components/regions/pages/new/new.component";
import { regionsRoute, shallowRegionsRoute } from "@components/regions/regions.routes";
import { ReportProblemComponent } from "@components/report-problem/report-problem.component";
import { reportProblemsRoute } from "@components/report-problem/report-problem.menus";
import { securityRoute } from "@components/security/security.menus";
import { ConfirmPasswordComponent } from "@components/security/pages/confirm-account/confirm-account.component";
import { LoginComponent } from "@components/security/pages/login/login.component";
import { RegisterComponent } from "@components/security/pages/register/register.component";
import { ResetPasswordComponent } from "@components/security/pages/reset-password/reset-password.component";
import { UnlockAccountComponent } from "@components/security/pages/unlock-account/unlock-account.component";
import { SendAudioComponent } from "@components/send-audio/send-audio.component";
import { sendAudioRoute } from "@components/send-audio/send-audio.menus";
import { WizardComponent } from "@components/sites/pages/wizard/wizard.component";
import { SiteComponent } from "@components/sites/components/site/site.component";
import { SiteDetailsComponent } from "@components/sites/pages/details/details.component";
import { SiteEditComponent } from "@components/sites/pages/edit/edit.component";
import { SiteNewComponent } from "@components/sites/pages/new/new.component";
import { sitesRoute } from "@components/sites/sites.routes";
import { pointsRoute } from "@components/sites/points.routes";
import { StatisticsComponent } from "@components/statistics/pages/statistics.component";
import { statisticsRoute } from "@components/statistics/statistics.menus";
import { WebsiteStatusComponent } from "@components/website-status/website-status.component";
import { websiteStatusRoute } from "@components/website-status/website-status.routes";
import { VisualizeComponent } from "@components/visualize/pages/details/details.component";
import { visualizeRoute } from "@components/visualize/visualize.routes";
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

const routes = [
  aboutRoute.compileRoutes(getRouteConfigForPage),
  adminRoute.compileRoutes(getRouteConfigForPage),
  analysesRoute.compileRoutes(getRouteConfigForPage),
  scriptsRoute.compileRoutes(getRouteConfigForPage),

  Object.values(audioRecordingsRoutes)
    .map((route) => route.compileRoutes(getRouteConfigForPage))
    .flat(),

  citSciRoute.compileRoutes(getRouteConfigForPage),
  dataRequestRoute.compileRoutes(getRouteConfigForPage),
  harvestsRoute.compileRoutes(getRouteConfigForPage),

  Object.values(reportsRoute)
    .map((route) => route.compileRoutes(getRouteConfigForPage))
    .flat(),

  Object.values(verificationRoute)
    .map((route) => route.compileRoutes(getRouteConfigForPage))
    .flat(),

  annotationsImportRoute.compileRoutes(getRouteConfigForPage),
  libraryRoute.compileRoutes(getRouteConfigForPage),
  listenRoute.compileRoutes(getRouteConfigForPage),
  myAccountRoute.compileRoutes(getRouteConfigForPage),
  theirProfileRoute.compileRoutes(getRouteConfigForPage),
  projectsRoute.compileRoutes(getRouteConfigForPage),
  regionsRoute.compileRoutes(getRouteConfigForPage),
  shallowRegionsRoute.compileRoutes(getRouteConfigForPage),
  reportProblemsRoute.compileRoutes(getRouteConfigForPage),
  securityRoute.compileRoutes(getRouteConfigForPage),
  sendAudioRoute.compileRoutes(getRouteConfigForPage),
  sitesRoute.compileRoutes(getRouteConfigForPage),
  pointsRoute.compileRoutes(getRouteConfigForPage),
  statisticsRoute.compileRoutes(getRouteConfigForPage),
  websiteStatusRoute.compileRoutes(getRouteConfigForPage),
  visualizeRoute.compileRoutes(getRouteConfigForPage),
].flat();

const pageComponents = [
  // about.module
  ContactUsComponent,
  CreditsComponent,
  DisclaimersComponent,
  EthicsComponent,
  DataSharingPolicyComponent,

  // admin.module
  AdminDashboardComponent,
  AdminUserListComponent,
  AdminThemeTemplateComponent,
  AllUploadsComponent,
  DateTimeExampleComponent,

  // analysis-jobs.module
  AnalysesComponent,
  AnalysisJobComponent,

  // scripts.module
  AdminScriptsComponent,
  AdminScriptComponent,
  AdminScriptsNewComponent,
  AdminScriptsEditComponent,

  // audio-recording.module
  AudioRecordingsListComponent,
  AudioRecordingsDetailsComponent,
  DownloadAudioRecordingsComponent,

  // citizen-science.module
  CitSciAboutComponent,
  CitSciListenComponent,
  CitSciListenItemComponent,
  CitSciResponsesComponent,

  // data-request.module
  DataRequestComponent,

  // harvest.module
  HarvestDetailsComponent,
  HarvestListComponent,
  HarvestNewComponent,

  // reports.module
  NewEventReportComponent,
  ViewEventReportComponent,

  // annotation.module
  VerificationComponent,
  AnnotationSearchComponent,

  // import-annotations.module
  AnnotationsListComponent,
  AnnotationImportDetailsComponent,
  NewAnnotationsComponent,
  EditAnnotationsComponent,
  AddAnnotationsComponent,

  // library.module
  LibraryComponent,
  AnnotationComponent,

  // listen.module
  ListenComponent,
  ListenRecordingComponent,

  // profile.module
  MyPasswordComponent,
  MyProfileComponent,
  MyEditComponent,
  MyProjectsComponent,
  MySitesComponent,
  MyBookmarksComponent,
  MyAnnotationsComponent,

  TheirProfileComponent,
  TheirEditComponent,
  TheirProjectsComponent,
  TheirSitesComponent,
  TheirBookmarksComponent,
  TheirAnnotationsComponent,

  // projects.module
  AssignComponent,
  ProjectDetailsComponent,
  ProjectEditComponent,
  ProjectListComponent,
  ProjectNewComponent,
  PermissionsComponent,
  RequestComponent,

  // regions.module
  RegionDetailsComponent,
  RegionEditComponent,
  RegionListComponent,
  RegionNewComponent,

  // report-problem.module
  ReportProblemComponent,

  // security.module
  LoginComponent,
  RegisterComponent,
  ResetPasswordComponent,
  ConfirmPasswordComponent,
  UnlockAccountComponent,

  // send-audio.module
  SendAudioComponent,

  // sites.module
  SiteComponent,
  SiteDetailsComponent,
  SiteEditComponent,
  SiteNewComponent,
  WizardComponent,

  // statistics.module
  StatisticsComponent,

  // website-status.module
  WebsiteStatusComponent,

  // visualize.module
  VisualizeComponent,
];

export const appLibraryImports = [
  ReactiveFormsModule,
  CustomInputsModule,
  DateValueAccessorModule,
  MenuModule,
];

domContentLoadedPromise.then(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      ...pageComponents,
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
        ErrorModule,
      ),

      { provide: TitleStrategy, useClass: PageTitleStrategy },
      // Show loading animation after 3 seconds
      { provide: LOADING_BAR_CONFIG, useValue: { latencyThreshold: 200 } },
      { provide: APP_ID, useValue: "workbench-client" },
    ],
  }).catch((err) => console.error(err));
});
