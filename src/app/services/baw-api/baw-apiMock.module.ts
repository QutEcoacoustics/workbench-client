import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FactoryProvider, NgModule, Provider } from "@angular/core";
import { mockProvider } from "@ngneat/spectator";
import { MockAppConfigModule } from "../app-config/app-configMock.module";
import { AccountsService } from "./account/accounts.service";
import { AnalysisJobItemsService } from "./analysis/analysis-job-items.service";
import { AnalysisJobsService } from "./analysis/analysis-jobs.service";
import { BawApiInterceptor } from "./api.interceptor.service";
import { AudioEventsService } from "./audio-event/audio-events.service";
import { AudioRecordingsService } from "./audio-recording/audio-recordings.service";
import { BawApiService, STUB_MODEL_BUILDER } from "./baw-api.service";
import { BookmarksService } from "./bookmark/bookmarks.service";
import { CmsService } from "./cms/cms.service";
import { DatasetItemsService } from "./dataset/dataset-items.service";
import { DatasetsService } from "./dataset/datasets.service";
import { MockBawApiService, MockModel } from "./mock/baseApiMock.service";
import { MockSecurityService } from "./mock/securityMock.service";
import { ProgressEventsService } from "./progress-event/progress-events.service";
import { ProjectsService } from "./project/projects.service";
import {
  RegionsService,
  ShallowRegionsService,
} from "./region/regions.service";
import { SavedSearchesService } from "./saved-search/saved-searches.service";
import { ScriptsService } from "./script/scripts.service";
import { SecurityService } from "./security/security.service";
import { serviceResolvers, services, serviceTokens } from "./ServiceProviders";
import { ShallowSitesService, SitesService } from "./site/sites.service";
import {
  QuestionsService,
  ShallowQuestionsService,
} from "./study/questions.service";
import {
  ResponsesService,
  ShallowResponsesService,
} from "./study/responses.service";
import { StudiesService } from "./study/studies.service";
import { TagGroupsService } from "./tag/tag-group.service";
import { TaggingsService } from "./tag/taggings.service";
import { TagsService } from "./tag/tags.service";
import { UserService } from "./user/user.service";

const mockProviders: Provider[] = [
  { provide: SecurityService, useClass: MockSecurityService },
  mockProvider(CmsService),
  mockProvider(AccountsService),
  mockProvider(AnalysisJobsService),
  mockProvider(AnalysisJobItemsService),
  mockProvider(AudioEventsService),
  mockProvider(AudioRecordingsService),
  mockProvider(BookmarksService),
  mockProvider(DatasetsService),
  mockProvider(DatasetItemsService),
  mockProvider(ProgressEventsService),
  mockProvider(ProjectsService),
  mockProvider(QuestionsService),
  mockProvider(ShallowQuestionsService),
  mockProvider(RegionsService),
  mockProvider(ShallowRegionsService),
  mockProvider(ResponsesService),
  mockProvider(ShallowResponsesService),
  mockProvider(SavedSearchesService),
  mockProvider(ScriptsService),
  mockProvider(SitesService),
  mockProvider(ShallowSitesService),
  mockProvider(StudiesService),
  mockProvider(TagsService),
  mockProvider(TagGroupsService),
  mockProvider(TaggingsService),
  mockProvider(UserService),
];

@NgModule({
  imports: [HttpClientModule, MockAppConfigModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BawApiInterceptor,
      multi: true,
    },
    { provide: STUB_MODEL_BUILDER, useValue: MockModel },
    { provide: BawApiService, useClass: MockBawApiService },
    ...services,
    ...serviceTokens,
    ...serviceResolvers,
    ...mockProviders,
  ],
})
export class MockBawApiModule {}
