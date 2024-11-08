import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgModule, Provider } from "@angular/core";
import { mockProvider } from "@ngneat/spectator";
import { CacheModule } from "@services/cache/cache.module";
import { mockAssociationInjector } from "@services/association-injector/association-injectorMock.factory";
import { MockConfigModule } from "../config/configMock.module";
import { AccountsService } from "./account/accounts.service";
import { AnalysisJobItemsService } from "./analysis/analysis-job-items.service";
import { AnalysisJobsService } from "./analysis/analysis-jobs.service";
import { BawApiInterceptor } from "./api.interceptor.service";
import {
  AudioEventsService,
  ShallowAudioEventsService,
} from "./audio-event/audio-events.service";
import { AudioRecordingsService } from "./audio-recording/audio-recordings.service";
import { BawApiService } from "./baw-api.service";
import { BawFormApiService } from "./baw-form-api.service";
import { BawSessionService } from "./baw-session.service";
import { BookmarksService } from "./bookmark/bookmarks.service";
import { CmsService } from "./cms/cms.service";
import { DatasetItemsService } from "./dataset/dataset-items.service";
import { DatasetsService } from "./dataset/datasets.service";
import {
  HarvestsService,
  ShallowHarvestsService,
} from "./harvest/harvest.service";
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
import { StatisticsService } from "./statistics/statistics.service";
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
import { WebsiteStatusService } from "./website-status/website-status.service";

// If you get the following error while trying to stub a service:
//
// TypeError: Cannot read properties of undefined (reading 'callFake')
//
// ...it is likely because your new service has not been setup for automatic
// mocking. Add it to the list below!
export const mockProviders: Provider[] = [
  { provide: SecurityService, useClass: MockSecurityService },
  mockProvider(BawApiService),
  mockProvider(BawFormApiService),
  mockProvider(CmsService),
  mockProvider(AccountsService),
  mockProvider(AnalysisJobsService),
  mockProvider(AnalysisJobItemsService),
  mockProvider(AudioEventsService),
  mockProvider(ShallowAudioEventsService),
  mockProvider(AudioRecordingsService),
  mockProvider(BookmarksService),
  mockProvider(DatasetsService),
  mockProvider(DatasetItemsService),
  mockProvider(HarvestsService),
  mockProvider(ShallowHarvestsService),
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
  mockProvider(StatisticsService),
  mockProvider(StudiesService),
  mockProvider(TagsService),
  mockProvider(TagGroupsService),
  mockProvider(TaggingsService),
  mockProvider(UserService),
  mockProvider(WebsiteStatusService),
];

@NgModule({
  imports: [HttpClientTestingModule, MockConfigModule, CacheModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BawApiInterceptor,
      multi: true,
    },
    mockAssociationInjector,
    BawSessionService,
    ...services,
    ...serviceTokens,
    ...serviceResolvers,
    ...mockProviders,
  ],
})
export class MockBawApiModule {}
